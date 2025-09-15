from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Q
from .models import UserProfile, Team, ActivityType, Activity, Challenge, WorkoutSuggestion
from .serializers import (
    UserProfileSerializer, TeamSerializer, ActivityTypeSerializer, 
    ActivitySerializer, ChallengeSerializer, WorkoutSuggestionSerializer,
    LeaderboardUserSerializer, LeaderboardTeamSerializer
)

# Create your views here.

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ActivityTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityType.objects.all()
    serializer_class = ActivityTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Activity.objects.filter(user=self.request.user)
        
        # Filter by date range if provided
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(date_logged__gte=start_date)
        if end_date:
            queryset = queryset.filter(date_logged__lte=end_date)
            
        return queryset

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get user's activity statistics"""
        user_activities = Activity.objects.filter(user=request.user)
        
        total_activities = user_activities.count()
        total_minutes = sum(activity.duration_minutes for activity in user_activities)
        total_points = sum(activity.points_awarded for activity in user_activities)
        
        # Group by activity type
        activity_breakdown = {}
        for activity in user_activities:
            activity_type = activity.activity_type.name
            if activity_type not in activity_breakdown:
                activity_breakdown[activity_type] = {
                    'count': 0,
                    'total_minutes': 0,
                    'total_points': 0
                }
            activity_breakdown[activity_type]['count'] += 1
            activity_breakdown[activity_type]['total_minutes'] += activity.duration_minutes
            activity_breakdown[activity_type]['total_points'] += activity.points_awarded

        return Response({
            'total_activities': total_activities,
            'total_minutes': total_minutes,
            'total_points': total_points,
            'activity_breakdown': activity_breakdown
        })

class TeamViewSet(viewsets.ModelViewSet):
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Team.objects.filter(
            Q(members=self.request.user) | Q(captain=self.request.user)
        ).distinct()

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """Join a team"""
        team = self.get_object()
        if request.user not in team.members.all():
            team.members.add(request.user)
            return Response({'status': 'joined'})
        return Response({'status': 'already_member'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """Leave a team"""
        team = self.get_object()
        if request.user in team.members.all() and request.user != team.captain:
            team.members.remove(request.user)
            return Response({'status': 'left'})
        return Response({'status': 'cannot_leave'}, status=status.HTTP_400_BAD_REQUEST)

class ChallengeViewSet(viewsets.ModelViewSet):
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Challenge.objects.filter(
            Q(participants=self.request.user) | Q(team_participants__members=self.request.user)
        ).distinct()

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """Join a challenge"""
        challenge = self.get_object()
        if challenge.challenge_type == 'individual':
            if request.user not in challenge.participants.all():
                challenge.participants.add(request.user)
                return Response({'status': 'joined'})
        return Response({'status': 'already_participating'}, status=status.HTTP_400_BAD_REQUEST)

class WorkoutSuggestionViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutSuggestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WorkoutSuggestion.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark workout suggestion as completed"""
        suggestion = self.get_object()
        suggestion.is_completed = True
        suggestion.save()
        return Response({'status': 'completed'})

class LeaderboardViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def users(self, request):
        """Get user leaderboard"""
        profiles = UserProfile.objects.select_related('user').order_by('-total_points')[:50]
        
        # Add rank to each profile
        for idx, profile in enumerate(profiles):
            profile.rank = idx + 1
            
        serializer = LeaderboardUserSerializer(profiles, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def teams(self, request):
        """Get team leaderboard"""
        teams = Team.objects.filter(is_active=True).order_by('-total_team_points')[:20]
        
        # Add rank to each team
        for idx, team in enumerate(teams):
            team.rank = idx + 1
            
        serializer = LeaderboardTeamSerializer(teams, many=True)
        return Response(serializer.data)
