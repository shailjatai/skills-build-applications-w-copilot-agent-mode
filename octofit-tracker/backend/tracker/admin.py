from django.contrib import admin
from .models import Team, UserProfile, Workout, Activity, LeaderboardEntry

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ("name", "description")

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("email", "first_name", "last_name", "team", "hero_alias")
    search_fields = ("email", "first_name", "last_name", "hero_alias")

@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ("name", "intensity")

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("user", "workout", "duration_minutes", "calories_burned", "timestamp")
    list_filter = ("timestamp",)

@admin.register(LeaderboardEntry)
class LeaderboardEntryAdmin(admin.ModelAdmin):
    list_display = ("user", "total_calories", "total_duration", "last_updated")
