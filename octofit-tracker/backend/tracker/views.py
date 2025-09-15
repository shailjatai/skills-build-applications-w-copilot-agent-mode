from rest_framework import viewsets
from .models import Team, UserProfile, Workout, Activity, LeaderboardEntry
from .serializers import TeamSerializer, UserProfileSerializer, WorkoutSerializer, ActivitySerializer, LeaderboardEntrySerializer

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all().select_related('user','workout')
    serializer_class = ActivitySerializer

class LeaderboardEntryViewSet(viewsets.ModelViewSet):
    queryset = LeaderboardEntry.objects.all().select_related('user')
    serializer_class = LeaderboardEntrySerializer
