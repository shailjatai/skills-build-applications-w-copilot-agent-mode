from django.contrib import admin
from .models import UserProfile, Team, ActivityType, Activity, Challenge, WorkoutSuggestion

# Register your models here.

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'fitness_level', 'total_points', 'created_at']
    list_filter = ['fitness_level', 'created_at']
    search_fields = ['user__username', 'user__first_name', 'user__last_name']

@admin.register(ActivityType)
class ActivityTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'points_per_minute']
    list_filter = ['category']
    search_fields = ['name']

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['user', 'activity_type', 'duration_minutes', 'intensity', 'points_awarded', 'date_logged']
    list_filter = ['activity_type', 'intensity', 'date_logged']
    search_fields = ['user__username', 'activity_type__name']
    date_hierarchy = 'date_logged'

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'captain', 'member_count', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'captain__username']
    filter_horizontal = ['members']

    def member_count(self, obj):
        return obj.members.count()
    member_count.short_description = 'Members'

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ['title', 'challenge_type', 'target_metric', 'target_value', 'start_date', 'end_date', 'is_active']
    list_filter = ['challenge_type', 'target_metric', 'is_active', 'start_date']
    search_fields = ['title', 'description']
    filter_horizontal = ['participants', 'team_participants']

@admin.register(WorkoutSuggestion)
class WorkoutSuggestionAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'difficulty_level', 'recommended_duration', 'is_completed', 'created_at']
    list_filter = ['difficulty_level', 'is_completed', 'created_at']
    search_fields = ['title', 'user__username']
    filter_horizontal = ['activity_types']
