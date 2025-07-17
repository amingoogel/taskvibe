from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Task, DailyPhoto, Mood, Group, Challenge
from .serializers import TaskSerializer, DailyPhotoSerializer, MoodSerializer, GroupSerializer, ChallengeSerializer
from .notifications import send_task_reminder, send_challenge_update

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        task = serializer.save(user=self.request.user)
        send_task_reminder(task)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        task = self.get_object()
        task.completed = True
        task.save()
        return Response({'status': 'task completed'})

class DailyPhotoViewSet(viewsets.ModelViewSet):
    queryset = DailyPhoto.objects.all()
    serializer_class = DailyPhotoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DailyPhoto.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MoodViewSet(viewsets.ModelViewSet):
    queryset = Mood.objects.all()
    serializer_class = MoodSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Mood.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Group.objects.filter(members=self.request.user)

    def perform_create(self, serializer):
        group = serializer.save()
        group.members.add(self.request.user)

class ChallengeViewSet(viewsets.ModelViewSet):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Challenge.objects.filter(group__members=self.request.user)

    def perform_create(self, serializer):
        challenge = serializer.save()
        for member in challenge.group.members.all():
            send_challenge_update(challenge, member)

    @action(detail=True, methods=['get'])
    def progress(self, request, pk=None):
        challenge = self.get_object()
        members = challenge.group.members.all()
        progress = []
        for member in members:
            completed_tasks = Task.objects.filter(
                user=member,
                completed=True,
                created_at__gte=challenge.created_at,
                created_at__lte=challenge.deadline
            ).count()
            progress.append({
                'username': member.username,
                'completed_tasks': completed_tasks,
                'target_tasks': challenge.target_tasks,
                'progress_percentage': (completed_tasks / challenge.target_tasks * 100) if challenge.target_tasks > 0 else 0
            })
        return Response(progress)