"""
URL configuration for octofit_tracker project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import routers
from tracker.views import (
    TeamViewSet,
    UserProfileViewSet,
    WorkoutViewSet,
    ActivityViewSet,
    LeaderboardEntryViewSet,
)

router = routers.DefaultRouter()
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'users', UserProfileViewSet, basename='userprofile')
router.register(r'workouts', WorkoutViewSet, basename='workout')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'leaderboard-entries', LeaderboardEntryViewSet, basename='leaderboardentry')

@api_view(['GET'])
def api_root(request, format=None):
    """
    API root - provides links to all available endpoints
    """
    codespace_name = os.environ.get('CODESPACE_NAME')
    if codespace_name:
        base_url = f"https://{codespace_name}-8000.app.github.dev"
    else:
        base_url = "http://localhost:8000"
    
    return Response({
        'teams': reverse('team-list', request=request, format=format),
        'users': reverse('userprofile-list', request=request, format=format),
        'workouts': reverse('workout-list', request=request, format=format),
        'activities': reverse('activity-list', request=request, format=format),
        'leaderboard_entries': reverse('leaderboardentry-list', request=request, format=format),
        'admin': f"{base_url}/admin/",
        'docs': 'Welcome to OctoFit Tracker API!'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/', include(router.urls)),
    path('api/fitness/', include('fitness.urls')),
]
