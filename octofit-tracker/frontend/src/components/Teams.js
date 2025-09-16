import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { teamsAPI, trackerTeamsAPI } from '../services/api';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: ''
  });

  // Load teams on component mount
  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try fitness teams first, then tracker teams as fallback
      let teamsResponse;
      try {
        teamsResponse = await teamsAPI.getAll();
      } catch (fitnessError) {
        console.warn('Fitness teams not available, trying tracker teams');
        teamsResponse = await trackerTeamsAPI.getAll();
      }
      
      setTeams(teamsResponse.results || []);
    } catch (err) {
      setError('Failed to load teams. Please try again.');
      console.error('Error loading teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);

      // Try fitness teams first, then tracker teams as fallback
      let newTeamData;
      try {
        newTeamData = await teamsAPI.create(newTeam);
      } catch (fitnessError) {
        console.warn('Fitness teams not available, using tracker teams');
        newTeamData = await trackerTeamsAPI.create(newTeam);
      }

      // Reload teams to get updated list
      await loadTeams();
      
      setNewTeam({ name: '', description: '' });
      setShowCreateModal(false);
    } catch (err) {
      setError('Failed to create team. Please try again.');
      console.error('Error creating team:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinTeam = async (teamId) => {
    try {
      setError(null);
      await teamsAPI.join(teamId);
      await loadTeams(); // Reload to get updated data
      setShowJoinModal(false);
    } catch (err) {
      setError('Failed to join team. Please try again.');
      console.error('Error joining team:', err);
    }
  };

  const handleLeaveTeam = async (teamId) => {
    try {
      setError(null);
      await teamsAPI.leave(teamId);
      await loadTeams(); // Reload to get updated data
    } catch (err) {
      setError('Failed to leave team. Please try again.');
      console.error('Error leaving team:', err);
    }
  };

  // For demo purposes, assume user is in some teams (in a real app, this would be managed by authentication)
  const myTeams = teams.slice(0, 2); // Show first 2 as user's teams for demo
  const availableTeams = teams.slice(2); // Rest as available teams

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading teams...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="text-primary">Teams</h2>
              <p className="text-muted">Join teams and compete together!</p>
            </div>
            <div>
              <Button 
                variant="success" 
                className="me-2"
                onClick={() => setShowJoinModal(true)}
              >
                <i className="fas fa-search me-2"></i>
                Browse Teams
              </Button>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                <i className="fas fa-plus me-2"></i>
                Create Team
              </Button>
            </div>
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

      {/* My Teams */}
      <Row className="mb-4">
        <Col>
          <h4 className="mb-3">My Teams</h4>
          {myTeams.length > 0 ? (
            <Row>
              {myTeams.map(team => (
                <Col md={6} lg={4} key={team.id} className="mb-3">
                  <Card className="h-100 border-primary">
                    <Card.Header className="bg-primary text-white">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">{team.name}</h6>
                        <Badge bg="light" text="dark">
                          {team.member_count || team.members?.length || 0} members
                        </Badge>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <p className="text-muted">{team.description || 'No description available'}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted">Team Points</small>
                          <div className="fw-bold text-primary">{team.total_team_points || 0}</div>
                        </div>
                        <div>
                          <small className="text-muted">Captain</small>
                          <div className="fw-bold">{team.captain?.username || team.captain || 'Unknown'}</div>
                        </div>
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <div className="d-flex justify-content-between">
                        <Button variant="outline-primary" size="sm">
                          View Details
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleLeaveTeam(team.id)}
                        >
                          Leave Team
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Card className="text-center">
              <Card.Body className="py-5">
                <i className="fas fa-users fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">You're not in any teams yet</h5>
                <p className="text-muted">Join a team or create your own to start competing!</p>
                <Button variant="primary" onClick={() => setShowJoinModal(true)}>
                  Browse Teams
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Create Team Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Team</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateTeam}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Team Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={newTeam.name}
                onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                placeholder="Enter team name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newTeam.description}
                onChange={(e) => setNewTeam({...newTeam, description: e.target.value})}
                placeholder="Describe your team's goals and focus"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Creating...
                </>
              ) : (
                'Create Team'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Browse Teams Modal */}
      <Modal show={showJoinModal} onHide={() => setShowJoinModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Browse Available Teams</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {availableTeams.length > 0 ? (
            <ListGroup>
              {availableTeams.map(team => (
                <ListGroup.Item key={team.id}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{team.name}</h6>
                      <p className="mb-1 text-muted">{team.description || 'No description available'}</p>
                      <div className="d-flex gap-3">
                        <small className="text-muted">
                          Captain: <span className="fw-bold">{team.captain?.username || team.captain || 'Unknown'}</span>
                        </small>
                        <small className="text-muted">
                          Members: <span className="fw-bold">{team.member_count || team.members?.length || 0}</span>
                        </small>
                        <small className="text-muted">
                          Points: <span className="fw-bold text-primary">{team.total_team_points || 0}</span>
                        </small>
                      </div>
                    </div>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleJoinTeam(team.id)}
                    >
                      Join Team
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div className="text-center py-4">
              <i className="fas fa-users fa-3x text-muted mb-3"></i>
              <p className="text-muted">No available teams to join right now.</p>
              <Button variant="primary" onClick={() => {
                setShowJoinModal(false);
                setShowCreateModal(true);
              }}>
                Create Your Own Team
              </Button>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowJoinModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Teams;