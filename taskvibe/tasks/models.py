from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    energy_level = models.CharField(max_length=20, choices=[
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title

class DailyPhoto(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='daily_photos/%Y/%m/%d/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    mood = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"Photo for {self.user.username} on {self.uploaded_at}"

class Mood(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mood = models.CharField(max_length=50, choices=[
        ('HAPPY', 'Happy'),
        ('TIRED', 'Tired'),
        ('ANXIOUS', 'Anxious'),
        ('EXCITED', 'Excited'),
    ])
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s mood: {self.mood}"

class Group(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(User)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Challenge(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    target_tasks = models.IntegerField(default=1)
    deadline = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title