import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge, Spinner, Alert } from 'react-bootstrap';
import { activitiesAPI } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalActivities: 0,
    totalMinutes: 0,
    totalPoints: 0,
    weeklyGoal: 150, // minutes per week
    weeklyProgress: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get stats first
      try {
        const statsResponse = await activitiesAPI.getStats();
        setStats(prev => ({
          ...prev,
          totalActivities: statsResponse.total_activities || 0,
          totalMinutes: statsResponse.total_minutes || 0,
          totalPoints: statsResponse.total_points || 0
        }));
      } catch (statsError) {
        console.warn('Stats endpoint not available, using activities list');
      }
      
      // Get recent activities
      const activitiesResponse = await activitiesAPI.getAll();
      const activities = activitiesResponse.results || [];
      setRecentActivities(activities.slice(0, 5)); // Show only recent 5

      // Calculate weekly progress from recent activities
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const thisWeekMinutes = activities.reduce((total, activity) => {
        const activityDate = new Date(activity.date_logged);
        if (activityDate >= oneWeekAgo) {
          return total + (activity.duration_minutes || 0);
        }
        return total;
      }, 0);

      setStats(prev => ({
        ...prev,
        weeklyProgress: thisWeekMinutes,
        // Update totals if stats endpoint wasn't available
        totalActivities: prev.totalActivities || activities.length,
        totalMinutes: prev.totalMinutes || activities.reduce((total, activity) => total + (activity.duration_minutes || 0), 0),
        totalPoints: prev.totalPoints || activities.reduce((total, activity) => total + (activity.points_awarded || 0), 0)
      }));

    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const weeklyPercentage = Math.min((stats.weeklyProgress / stats.weeklyGoal) * 100, 100);

  const getIntensityBadge = (intensity) => {
    const variants = {
      low: 'success',
      medium: 'warning',
      high: 'danger'
    };
    return <Badge bg={variants[intensity]}>{intensity.toUpperCase()}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const getActivityTypeName = (activity) => {
    if (activity.activity_type && activity.activity_type.name) {
      return activity.activity_type.name;
    }
    // Fallback for different API structures
    return activity.type || 'Unknown Activity';
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading dashboard...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary">Fitness Dashboard</h2>
          <p className="text-muted">Track your progress and stay motivated!</p>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="text-center h-100 border-primary">
            <Card.Body>
              <i className="fas fa-chart-line fa-2x text-primary mb-2"></i>
              <h4 className="text-primary">{stats.totalActivities}</h4>
              <p className="text-muted mb-0">Total Activities</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center h-100 border-success">
            <Card.Body>
              <i className="fas fa-clock fa-2x text-success mb-2"></i>
              <h4 className="text-success">{stats.totalMinutes}</h4>
              <p className="text-muted mb-0">Minutes Exercised</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center h-100 border-warning">
            <Card.Body>
              <i className="fas fa-star fa-2x text-warning mb-2"></i>
              <h4 className="text-warning">{stats.totalPoints}</h4>
              <p className="text-muted mb-0">Points Earned</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center h-100 border-info">
            <Card.Body>
              <i className="fas fa-trophy fa-2x text-info mb-2"></i>
              <h4 className="text-info">#{Math.floor(Math.random() * 50) + 1}</h4>
              <p className="text-muted mb-0">Leaderboard Rank</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Weekly Goal Progress */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Weekly Goal Progress</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Weekly Exercise Goal</span>
                <span>{stats.weeklyProgress} / {stats.weeklyGoal} minutes</span>
              </div>
              <ProgressBar 
                now={weeklyPercentage} 
                variant={weeklyPercentage >= 100 ? 'success' : 'primary'}
                style={{ height: '20px' }}
              />
              <div className="mt-2 text-center">
                <small className="text-muted">
                  {weeklyPercentage >= 100 ? 
                    '🎉 Congratulations! You\'ve reached your weekly goal!' : 
                    `${Math.round(weeklyPercentage)}% complete`
                  }
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Activities</h5>
            </Card.Header>
            <Card.Body>
              {recentActivities.length > 0 ? (
                <div>
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div>
                        <strong>{getActivityTypeName(activity)}</strong>
                        <div className="text-muted small">
                          {formatDate(activity.date_logged)} • {activity.duration_minutes || 0} minutes
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="mb-1">
                          {getIntensityBadge(activity.intensity || 'medium')}
                        </div>
                        <div className="text-primary font-weight-bold">
                          {activity.points_awarded || 0} points
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="fas fa-running fa-3x mb-3"></i>
                  <p>No activities logged yet. Start tracking your workouts!</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;