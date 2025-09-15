from rest_framework import serializers
from .models import Team, UserProfile, Workout, Activity, LeaderboardEntry

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    team = TeamSerializer(read_only=True)
    team_id = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(), source='team', write_only=True, allow_null=True, required=False
    )
    class Meta:
        model = UserProfile
        fields = ['id','first_name','last_name','email','hero_alias','team','team_id']

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'

class ActivitySerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=UserProfile.objects.all(), source='user', write_only=True)
    workout = WorkoutSerializer(read_only=True)
    workout_id = serializers.PrimaryKeyRelatedField(queryset=Workout.objects.all(), source='workout', write_only=True, allow_null=True, required=False)
    class Meta:
        model = Activity
        fields = ['id','user','user_id','workout','workout_id','duration_minutes','calories_burned','timestamp']

class LeaderboardEntrySerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=UserProfile.objects.all(), source='user', write_only=True)
    class Meta:
        model = LeaderboardEntry
        fields = ['id','user','user_id','total_calories','total_duration','last_updated']
