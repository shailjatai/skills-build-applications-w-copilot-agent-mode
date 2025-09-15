import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge } from 'react-bootstrap';

function Dashboard() {
  const [stats, setStats] = useState({
    totalActivities: 0,
    totalMinutes: 0,
    totalPoints: 0,
    weeklyGoal: 150, // minutes per week
    weeklyProgress: 0
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'Running',
      duration: 30,
      points: 45,
      date: '2025-09-15',
      intensity: 'high'
    },
    {
      id: 2,
      type: 'Weight Training',
      duration: 45,
      points: 59,
      date: '2025-09-14',
      intensity: 'medium'
    },
    {
      id: 3,
      type: 'Yoga',
      duration: 60,
      points: 48,
      date: '2025-09-13',
      intensity: 'low'
    }
  ]);

  useEffect(() => {
    // Calculate weekly progress from recent activities
    const thisWeekMinutes = recentActivities.reduce((total, activity) => {
      const activityDate = new Date(activity.date);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      if (activityDate >= oneWeekAgo) {
        return total + activity.duration;
      }
      return total;
    }, 0);

    setStats(prev => ({
      ...prev,
      totalActivities: recentActivities.length,
      totalMinutes: recentActivities.reduce((total, activity) => total + activity.duration, 0),
      totalPoints: recentActivities.reduce((total, activity) => total + activity.points, 0),
      weeklyProgress: thisWeekMinutes
    }));
  }, [recentActivities]);

  const weeklyPercentage = Math.min((stats.weeklyProgress / stats.weeklyGoal) * 100, 100);

  const getIntensityBadge = (intensity) => {
    const variants = {
      low: 'success',
      medium: 'warning',
      high: 'danger'
    };
    return <Badge bg={variants[intensity]}>{intensity.toUpperCase()}</Badge>;
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary">Fitness Dashboard</h2>
          <p className="text-muted">Track your progress and stay motivated!</p>
        </Col>
      </Row>

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
                        <strong>{activity.type}</strong>
                        <div className="text-muted small">
                          {activity.date} • {activity.duration} minutes
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="mb-1">
                          {getIntensityBadge(activity.intensity)}
                        </div>
                        <div className="text-primary font-weight-bold">
                          {activity.points} points
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