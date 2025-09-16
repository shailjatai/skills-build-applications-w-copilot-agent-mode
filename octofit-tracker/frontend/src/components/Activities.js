import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Badge, Alert, Spinner } from 'react-bootstrap';
import { activityTypesAPI, activitiesAPI } from '../services/api';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newActivity, setNewActivity] = useState({
    activity_type_id: '',
    duration_minutes: '',
    intensity: 'medium',
    distance: '',
    notes: ''
  });

  // Load activity types and activities on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [typesResponse, activitiesResponse] = await Promise.all([
        activityTypesAPI.getAll(),
        activitiesAPI.getAll()
      ]);
      
      setActivityTypes(typesResponse.results || []);
      setActivities(activitiesResponse.results || []);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);

      const activityData = {
        activity_type_id: parseInt(newActivity.activity_type_id),
        duration_minutes: parseInt(newActivity.duration_minutes),
        intensity: newActivity.intensity,
        distance: newActivity.distance ? parseFloat(newActivity.distance) : null,
        notes: newActivity.notes
      };

      await activitiesAPI.create(activityData);
      
      // Reload activities to get the updated list
      await loadData();
      
      setNewActivity({
        activity_type_id: '',
        duration_minutes: '',
        intensity: 'medium',
        distance: '',
        notes: ''
      });
      setShowModal(false);
    } catch (err) {
      setError('Failed to create activity. Please try again.');
      console.error('Error creating activity:', err);
    } finally {
      setSubmitting(false);
    }
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
    totalMinutes: activities.reduce((sum, activity) => sum + (activity.duration_minutes || 0), 0),
    totalPoints: activities.reduce((sum, activity) => sum + (activity.points_awarded || 0), 0)
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const getActivityTypeName = (typeId) => {
    const type = activityTypes.find(t => t.id === typeId);
    return type ? type.name : 'Unknown';
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading activities...</p>
      </Container>
    );
  }

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

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

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
                        <td>{formatDate(activity.date_logged)}</td>
                        <td><strong>{getActivityTypeName(activity.activity_type?.id || activity.activity_type_id)}</strong></td>
                        <td>{activity.duration_minutes} min</td>
                        <td>{getIntensityBadge(activity.intensity)}</td>
                        <td>{activity.distance ? `${activity.distance} km` : '-'}</td>
                        <td><Badge bg="primary">{activity.points_awarded || 0}</Badge></td>
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
                value={newActivity.activity_type_id}
                onChange={(e) => setNewActivity({...newActivity, activity_type_id: e.target.value})}
                required
              >
                <option value="">Select an activity type</option>
                {activityTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duration (minutes)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                required
                value={newActivity.duration_minutes}
                onChange={(e) => setNewActivity({...newActivity, duration_minutes: e.target.value})}
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
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Logging...
                </>
              ) : (
                'Log Activity'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default Activities;