// API configuration and helper functions for OctoFit Tracker

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`
  : 'http://localhost:8000/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Activity Types API
export const activityTypesAPI = {
  getAll: () => apiRequest('/fitness/activity-types/'),
};

// Activities API
export const activitiesAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/fitness/activities/${queryString ? `?${queryString}` : ''}`);
  },
  create: (activity) => apiRequest('/fitness/activities/', {
    method: 'POST',
    body: JSON.stringify(activity),
  }),
  getStats: () => apiRequest('/fitness/activities/stats/'),
};

// Teams API
export const teamsAPI = {
  getAll: () => apiRequest('/fitness/teams/'),
  create: (team) => apiRequest('/fitness/teams/', {
    method: 'POST',
    body: JSON.stringify(team),
  }),
  join: (teamId) => apiRequest(`/fitness/teams/${teamId}/join/`, {
    method: 'POST',
  }),
  leave: (teamId) => apiRequest(`/fitness/teams/${teamId}/leave/`, {
    method: 'POST',
  }),
};

// Tracker Teams API (simplified model)
export const trackerTeamsAPI = {
  getAll: () => apiRequest('/tracker/teams/'),
  create: (team) => apiRequest('/tracker/teams/', {
    method: 'POST',
    body: JSON.stringify(team),
  }),
};

// User Profiles API
export const userProfilesAPI = {
  getAll: () => apiRequest('/tracker/users/'),
  create: (profile) => apiRequest('/tracker/users/', {
    method: 'POST',
    body: JSON.stringify(profile),
  }),
};

// Workouts API
export const workoutsAPI = {
  getAll: () => apiRequest('/tracker/workouts/'),
  create: (workout) => apiRequest('/tracker/workouts/', {
    method: 'POST',
    body: JSON.stringify(workout),
  }),
};

// Tracker Activities API (simplified model)
export const trackerActivitiesAPI = {
  getAll: () => apiRequest('/tracker/activities/'),
  create: (activity) => apiRequest('/tracker/activities/', {
    method: 'POST',
    body: JSON.stringify(activity),
  }),
};

// Leaderboard API
export const leaderboardAPI = {
  getUsers: () => apiRequest('/fitness/leaderboard/users/'),
  getTeams: () => apiRequest('/fitness/leaderboard/teams/'),
  getEntries: () => apiRequest('/tracker/leaderboard-entries/'),
};

// Challenges API
export const challengesAPI = {
  getAll: () => apiRequest('/fitness/challenges/'),
  join: (challengeId) => apiRequest(`/fitness/challenges/${challengeId}/join/`, {
    method: 'POST',
  }),
};

// Workout Suggestions API
export const workoutSuggestionsAPI = {
  getAll: () => apiRequest('/fitness/workout-suggestions/'),
  complete: (suggestionId) => apiRequest(`/fitness/workout-suggestions/${suggestionId}/complete/`, {
    method: 'POST',
  }),
};

export default {
  activityTypesAPI,
  activitiesAPI,
  teamsAPI,
  trackerTeamsAPI,
  userProfilesAPI,
  workoutsAPI,
  trackerActivitiesAPI,
  leaderboardAPI,
  challengesAPI,
  workoutSuggestionsAPI,
};