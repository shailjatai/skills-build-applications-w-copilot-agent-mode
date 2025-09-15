from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'profiles', views.UserProfileViewSet, basename='userprofile')
router.register(r'activity-types', views.ActivityTypeViewSet)
router.register(r'activities', views.ActivityViewSet, basename='activity')
router.register(r'teams', views.TeamViewSet, basename='team')
router.register(r'challenges', views.ChallengeViewSet, basename='challenge')
router.register(r'workout-suggestions', views.WorkoutSuggestionViewSet, basename='workoutsuggestion')
router.register(r'leaderboard', views.LeaderboardViewSet, basename='leaderboard')

urlpatterns = [
    path('', include(router.urls)),
]