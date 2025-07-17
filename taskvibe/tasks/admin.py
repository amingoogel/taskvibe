from django.contrib import admin
from .models import Task, DailyPhoto, Mood, Group, Challenge

admin.site.register(Task)
admin.site.register(DailyPhoto)
admin.site.register(Mood)
admin.site.register(Group)
admin.site.register(Challenge)