from django.db import models

class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class UserProfile(models.Model):
    team = models.ForeignKey(Team, related_name='members', on_delete=models.SET_NULL, null=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    hero_alias = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.hero_alias or self.first_name} ({self.email})"

class Workout(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    intensity = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name

class Activity(models.Model):
    user = models.ForeignKey(UserProfile, related_name='activities', on_delete=models.CASCADE)
    workout = models.ForeignKey(Workout, related_name='activities', on_delete=models.SET_NULL, null=True, blank=True)
    duration_minutes = models.PositiveIntegerField()
    calories_burned = models.PositiveIntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.duration_minutes}m"

class LeaderboardEntry(models.Model):
    user = models.ForeignKey(UserProfile, related_name='leaderboard_entries', on_delete=models.CASCADE)
    total_calories = models.PositiveIntegerField(default=0)
    total_duration = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Leaderboard Entry'
        verbose_name_plural = 'Leaderboard Entries'

    def __str__(self):
        return f"{self.user} - {self.total_calories} cal"
