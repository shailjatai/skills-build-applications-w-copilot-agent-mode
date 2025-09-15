from django.core.management.base import BaseCommand
from tracker.models import Team, UserProfile, Workout, Activity, LeaderboardEntry
from django.db import transaction

MARVEL_HEROES = [
    ("Tony", "Stark", "tony.stark@avengers.com", "Iron Man"),
    ("Steve", "Rogers", "steve.rogers@avengers.com", "Captain America"),
    ("Natasha", "Romanoff", "natasha.romanoff@avengers.com", "Black Widow"),
]

DC_HEROES = [
    ("Bruce", "Wayne", "bruce.wayne@justiceleague.com", "Batman"),
    ("Clark", "Kent", "clark.kent@justiceleague.com", "Superman"),
    ("Diana", "Prince", "diana.prince@justiceleague.com", "Wonder Woman"),
]

WORKOUTS = [
    ("Cardio Blast", "High intensity cardio session", "High"),
    ("Strength Training", "Muscle building routine", "Medium"),
    ("Recovery Stretch", "Light stretching and mobility", "Low"),
]

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Clearing existing data...'))
        with transaction.atomic():
            Activity.objects.all().delete()
            LeaderboardEntry.objects.all().delete()
            UserProfile.objects.all().delete()
            Team.objects.all().delete()
            Workout.objects.all().delete()

            self.stdout.write(self.style.SUCCESS('Existing data cleared.'))

            marvel_team = Team.objects.create(name='Marvel', description='Marvel Heroes Team')
            dc_team = Team.objects.create(name='DC', description='DC Heroes Team')

            hero_profiles = []
            for first, last, email, alias in MARVEL_HEROES:
                hero_profiles.append(UserProfile.objects.create(team=marvel_team, first_name=first, last_name=last, email=email, hero_alias=alias))
            for first, last, email, alias in DC_HEROES:
                hero_profiles.append(UserProfile.objects.create(team=dc_team, first_name=first, last_name=last, email=email, hero_alias=alias))

            workout_objs = []
            for name, desc, intensity in WORKOUTS:
                workout_objs.append(Workout.objects.create(name=name, description=desc, intensity=intensity))

            # Create some sample activities and leaderboard entries
            for profile in hero_profiles:
                total_cal = 0
                total_dur = 0
                for workout in workout_objs:
                    duration = 30
                    calories = 200
                    Activity.objects.create(user=profile, workout=workout, duration_minutes=duration, calories_burned=calories)
                    total_cal += calories
                    total_dur += duration
                LeaderboardEntry.objects.create(user=profile, total_calories=total_cal, total_duration=total_dur)

        self.stdout.write(self.style.SUCCESS('Database populated with test Marvel and DC hero data.'))
