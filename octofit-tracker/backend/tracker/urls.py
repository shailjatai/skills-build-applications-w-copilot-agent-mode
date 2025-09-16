from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'teams', views.TeamViewSet)
router.register(r'users', views.UserProfileViewSet)
router.register(r'workouts', views.WorkoutViewSet)
router.register(r'activities', views.ActivityViewSet)
router.register(r'leaderboard-entries', views.LeaderboardEntryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]