from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, DailyPhotoViewSet, MoodViewSet, GroupViewSet, ChallengeViewSet
from .analytics import  TaskAnalyticsView
from .auth_views import RegisterView, LoginView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'photos', DailyPhotoViewSet)
router.register(r'moods', MoodViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'challenges', ChallengeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('analytics/', TaskAnalyticsView.as_view(), name='analytics'),
]