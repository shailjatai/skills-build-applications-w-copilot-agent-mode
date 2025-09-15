from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.

class UserProfile(models.Model):
    """Extended user profile for fitness tracking"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    height = models.FloatField(null=True, blank=True, help_text="Height in cm")
    weight = models.FloatField(null=True, blank=True, help_text="Weight in kg")
    date_of_birth = models.DateField(null=True, blank=True)
    fitness_level = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
        ],
        default='beginner'
    )
    total_points = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class Team(models.Model):
    """Teams for competitive fitness challenges"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    captain = models.ForeignKey(User, on_delete=models.CASCADE, related_name='captained_teams')
    members = models.ManyToManyField(User, related_name='teams', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    @property
    def total_team_points(self):
        """Calculate total points for all team members"""
        return sum(member.userprofile.total_points for member in self.members.all() if hasattr(member, 'userprofile'))

class ActivityType(models.Model):
    """Different types of fitness activities"""
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    points_per_minute = models.FloatField(default=1.0, help_text="Points awarded per minute of activity")
    category = models.CharField(
        max_length=20,
        choices=[
            ('cardio', 'Cardio'),
            ('strength', 'Strength Training'),
            ('flexibility', 'Flexibility'),
            ('sports', 'Sports'),
            ('other', 'Other'),
        ],
        default='other'
    )

    def __str__(self):
        return self.name

class Activity(models.Model):
    """Individual activity records"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity_type = models.ForeignKey(ActivityType, on_delete=models.CASCADE)
    duration_minutes = models.IntegerField(help_text="Duration in minutes")
    intensity = models.CharField(
        max_length=10,
        choices=[
            ('low', 'Low'),
            ('medium', 'Medium'),
            ('high', 'High'),
        ],
        default='medium'
    )
    distance = models.FloatField(null=True, blank=True, help_text="Distance in km (if applicable)")
    calories_burned = models.IntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)
    date_logged = models.DateTimeField(default=timezone.now)
    points_awarded = models.IntegerField(default=0)

    class Meta:
        ordering = ['-date_logged']
        verbose_name_plural = 'Activities'

    def save(self, *args, **kwargs):
        # Calculate points based on duration and activity type
        base_points = self.duration_minutes * self.activity_type.points_per_minute
        
        # Apply intensity multiplier
        intensity_multipliers = {'low': 0.8, 'medium': 1.0, 'high': 1.3}
        self.points_awarded = int(base_points * intensity_multipliers[self.intensity])
        
        super().save(*args, **kwargs)
        
        # Update user's total points
        user_profile, created = UserProfile.objects.get_or_create(user=self.user)
        total_points = Activity.objects.filter(user=self.user).aggregate(
            total=models.Sum('points_awarded')
        )['total'] or 0
        user_profile.total_points = total_points
        user_profile.save()

    def __str__(self):
        return f"{self.user.username} - {self.activity_type.name} ({self.duration_minutes}min)"

class Challenge(models.Model):
    """Fitness challenges for individuals or teams"""
    title = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    challenge_type = models.CharField(
        max_length=20,
        choices=[
            ('individual', 'Individual'),
            ('team', 'Team'),
        ],
        default='individual'
    )
    target_value = models.IntegerField(help_text="Target value (minutes, points, etc.)")
    target_metric = models.CharField(
        max_length=20,
        choices=[
            ('minutes', 'Total Minutes'),
            ('points', 'Total Points'),
            ('activities', 'Number of Activities'),
        ],
        default='points'
    )
    participants = models.ManyToManyField(User, related_name='challenges', blank=True)
    team_participants = models.ManyToManyField(Team, related_name='team_challenges', blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class WorkoutSuggestion(models.Model):
    """Personalized workout suggestions"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    recommended_duration = models.IntegerField(help_text="Recommended duration in minutes")
    difficulty_level = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
        ]
    )
    activity_types = models.ManyToManyField(ActivityType, related_name='workout_suggestions')
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} for {self.user.username}"
