from rest_framework import serializers
from .models import Task, DailyPhoto, Mood, Group, Challenge

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'completed', 'energy_level', 'created_at', 'due_date']

class DailyPhotoSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(max_length=None, use_url=True)

    class Meta:
        model = DailyPhoto
        fields = ['id', 'photo', 'mood', 'uploaded_at']

class MoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mood
        fields = ['id', 'mood', 'recorded_at']

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'members', 'created_at']

class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ['id', 'group', 'title', 'description', 'target_tasks', 'deadline']