from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Team, ActivityType, Activity, Challenge, WorkoutSuggestion

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'height', 'weight', 'date_of_birth', 'fitness_level', 'total_points', 'created_at', 'updated_at']

class ActivityTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityType
        fields = ['id', 'name', 'description', 'points_per_minute', 'category']

class ActivitySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    activity_type = ActivityTypeSerializer(read_only=True)
    activity_type_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Activity
        fields = ['id', 'user', 'activity_type', 'activity_type_id', 'duration_minutes', 'intensity', 
                 'distance', 'calories_burned', 'notes', 'date_logged', 'points_awarded']
        read_only_fields = ['points_awarded']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class TeamSerializer(serializers.ModelSerializer):
    captain = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)
    member_count = serializers.SerializerMethodField()
    total_team_points = serializers.ReadOnlyField()
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'captain', 'members', 'member_count', 
                 'total_team_points', 'created_at', 'is_active']

    def get_member_count(self, obj):
        return obj.members.count()

    def create(self, validated_data):
        validated_data['captain'] = self.context['request'].user
        team = super().create(validated_data)
        team.members.add(self.context['request'].user)  # Add captain as member
        return team

class ChallengeSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    team_participants = TeamSerializer(many=True, read_only=True)
    participant_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Challenge
        fields = ['id', 'title', 'description', 'start_date', 'end_date', 'challenge_type',
                 'target_value', 'target_metric', 'participants', 'team_participants', 
                 'participant_count', 'is_active', 'created_at']

    def get_participant_count(self, obj):
        return obj.participants.count() + obj.team_participants.count()

class WorkoutSuggestionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    activity_types = ActivityTypeSerializer(many=True, read_only=True)
    
    class Meta:
        model = WorkoutSuggestion
        fields = ['id', 'user', 'title', 'description', 'recommended_duration', 
                 'difficulty_level', 'activity_types', 'is_completed', 'created_at', 'completed_at']

# Leaderboard serializers
class LeaderboardUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    rank = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'first_name', 'last_name', 'total_points', 'rank']

    def get_rank(self, obj):
        # This would be set in the view
        return getattr(obj, 'rank', None)

class LeaderboardTeamSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()
    rank = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'total_team_points', 'member_count', 'rank']

    def get_member_count(self, obj):
        return obj.members.count()

    def get_rank(self, obj):
        # This would be set in the view
        return getattr(obj, 'rank', None)