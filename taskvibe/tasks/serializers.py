from rest_framework import serializers
from .models import Task, DailyPhoto, Mood, Group, Challenge, Profile, Message
from django.contrib.auth.models import User

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['avatar']

class UserProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(source='profile.avatar', read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'avatar']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'completed', 'energy_level', 'priority', 'tags', 'recurring', 'created_at', 'due_date']

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
    members = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    class Meta:
        model = Group
        fields = ['id', 'name', 'members', 'created_at']

class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ['id', 'group', 'title', 'description', 'target_tasks', 'deadline']

class MessageSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Message
        fields = ['id', 'group', 'user', 'content', 'timestamp']