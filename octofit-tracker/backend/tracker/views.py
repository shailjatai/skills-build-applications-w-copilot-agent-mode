from rest_framework import viewsets, permissions
from .models import Team, UserProfile, Workout, Activity, LeaderboardEntry
from .serializers import TeamSerializer, UserProfileSerializer, WorkoutSerializer, ActivitySerializer, LeaderboardEntrySerializer

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.AllowAny]

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.AllowAny]

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    permission_classes = [permissions.AllowAny]

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all().select_related('user','workout')
    serializer_class = ActivitySerializer
    permission_classes = [permissions.AllowAny]

class LeaderboardEntryViewSet(viewsets.ModelViewSet):
    queryset = LeaderboardEntry.objects.all().select_related('user')
    serializer_class = LeaderboardEntrySerializer
    permission_classes = [permissions.AllowAny]
