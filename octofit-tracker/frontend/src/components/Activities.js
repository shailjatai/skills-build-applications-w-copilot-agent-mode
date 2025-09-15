import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Badge } from 'react-bootstrap';

function Activities() {
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'Running',
      duration: 30,
      points: 45,
      date: '2025-09-15',
      intensity: 'high',
      distance: 5.0,
      notes: 'Morning jog around the park'
    },
    {
      id: 2,
      type: 'Weight Training',
      duration: 45,
      points: 59,
      date: '2025-09-14',
      intensity: 'medium',
      distance: null,
      notes: 'Upper body workout'
    },
    {
      id: 3,
      type: 'Yoga',
      duration: 60,
      points: 48,
      date: '2025-09-13',
      intensity: 'low',
      distance: null,
      notes: 'Relaxing evening session'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    type: 'Running',
    duration: '',
    intensity: 'medium',
    distance: '',
    notes: ''
  });

  const activityTypes = [
    'Running', 'Walking', 'Weight Training', 'Yoga', 'Cycling', 
    'Swimming', 'Basketball', 'Soccer', 'Dance', 'Pilates'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate points (simplified calculation)
    const pointsPerMinute = {
      'Running': 1.5,
      'Walking': 1.0,
      'Weight Training': 1.3,
      'Yoga': 0.8,
      'Cycling': 1.4,
      'Swimming': 1.6,
      'Basketball': 1.5,
      'Soccer': 1.4,
      'Dance': 1.2,
      'Pilates': 1.0
    };

    const intensityMultiplier = {
      'low': 0.8,
      'medium': 1.0,
      'high': 1.3
    };

    const basePoints = parseInt(newActivity.duration) * pointsPerMinute[newActivity.type];
    const totalPoints = Math.round(basePoints * intensityMultiplier[newActivity.intensity]);

    const activity = {
      id: Date.now(),
      type: newActivity.type,
      duration: parseInt(newActivity.duration),
      points: totalPoints,
      date: new Date().toISOString().split('T')[0],
      intensity: newActivity.intensity,
      distance: newActivity.distance ? parseFloat(newActivity.distance) : null,
      notes: newActivity.notes
    };

    setActivities([activity, ...activities]);
    setNewActivity({
      type: 'Running',
      duration: '',
      intensity: 'medium',
      distance: '',
      notes: ''
    });
    setShowModal(false);
  };

  const getIntensityBadge = (intensity) => {
    const variants = {
      low: 'success',
      medium: 'warning',
      high: 'danger'
    };
    return <Badge bg={variants[intensity]}>{intensity.toUpperCase()}</Badge>;
  };

  const totalStats = {
    totalActivities: activities.length,
    totalMinutes: activities.reduce((sum, activity) => sum + activity.duration, 0),
    totalPoints: activities.reduce((sum, activity) => sum + activity.points, 0)
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="text-primary">My Activities</h2>
              <p className="text-muted">Track and manage your fitness activities</p>
            </div>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <i className="fas fa-plus me-2"></i>
              Log Activity
            </Button>
          </div>
        </Col>
      </Row>

      {/* Summary Stats */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center border-primary">
            <Card.Body>
              <h4 className="text-primary">{totalStats.totalActivities}</h4>
              <p className="text-muted mb-0">Total Activities</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center border-success">
            <Card.Body>
              <h4 className="text-success">{totalStats.totalMinutes}</h4>
              <p className="text-muted mb-0">Minutes Exercised</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center border-warning">
            <Card.Body>
              <h4 className="text-warning">{totalStats.totalPoints}</h4>
              <p className="text-muted mb-0">Points Earned</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Activities Table */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Activity History</h5>
            </Card.Header>
            <Card.Body>
              {activities.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Activity</th>
                      <th>Duration</th>
                      <th>Intensity</th>
                      <th>Distance</th>
                      <th>Points</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map(activity => (
                      <tr key={activity.id}>
                        <td>{activity.date}</td>
                        <td><strong>{activity.type}</strong></td>
                        <td>{activity.duration} min</td>
                        <td>{getIntensityBadge(activity.intensity)}</td>
                        <td>{activity.distance ? `${activity.distance} km` : '-'}</td>
                        <td><Badge bg="primary">{activity.points}</Badge></td>
                        <td className="text-muted">{activity.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="fas fa-dumbbell fa-3x mb-3"></i>
                  <p>No activities logged yet. Start tracking your workouts!</p>
                  <Button variant="primary" onClick={() => setShowModal(true)}>
                    Log Your First Activity
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Activity Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Log New Activity</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Activity Type</Form.Label>
              <Form.Select
                value={newActivity.type}
                onChange={(e) => setNewActivity({...newActivity, type: e.target.value})}
              >
                {activityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duration (minutes)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                required
                value={newActivity.duration}
                onChange={(e) => setNewActivity({...newActivity, duration: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Intensity</Form.Label>
              <Form.Select
                value={newActivity.intensity}
                onChange={(e) => setNewActivity({...newActivity, intensity: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Distance (km) - Optional</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                min="0"
                value={newActivity.distance}
                onChange={(e) => setNewActivity({...newActivity, distance: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes - Optional</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newActivity.notes}
                onChange={(e) => setNewActivity({...newActivity, notes: e.target.value})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Log Activity
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default Activities;