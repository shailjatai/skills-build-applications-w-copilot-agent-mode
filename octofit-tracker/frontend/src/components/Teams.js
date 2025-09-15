import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge, ListGroup } from 'react-bootstrap';

function Teams() {
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: 'Fitness Warriors',
      description: 'Dedicated to crushing fitness goals together!',
      captain: 'john_doe',
      members: ['john_doe', 'jane_smith', 'mike_johnson'],
      totalPoints: 1250,
      isActive: true
    },
    {
      id: 2,
      name: 'Cardio Crew',
      description: 'Running, cycling, and cardio enthusiasts',
      captain: 'sarah_wilson',
      members: ['sarah_wilson', 'david_brown', 'lisa_taylor'],
      totalPoints: 980,
      isActive: true
    },
    {
      id: 3,
      name: 'Strength Squad',
      description: 'Lifting heavy and getting stronger every day',
      captain: 'alex_garcia',
      members: ['alex_garcia', 'chris_lee', 'emma_davis'],
      totalPoints: 1100,
      isActive: true
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: ''
  });

  const [userTeams, setUserTeams] = useState([1]); // User is member of team 1

  const handleCreateTeam = (e) => {
    e.preventDefault();
    const team = {
      id: Date.now(),
      name: newTeam.name,
      description: newTeam.description,
      captain: 'current_user', // In real app, this would be the current user
      members: ['current_user'],
      totalPoints: 0,
      isActive: true
    };

    setTeams([...teams, team]);
    setUserTeams([...userTeams, team.id]);
    setNewTeam({ name: '', description: '' });
    setShowCreateModal(false);
  };

  const handleJoinTeam = (teamId) => {
    if (!userTeams.includes(teamId)) {
      setUserTeams([...userTeams, teamId]);
      // In a real app, you'd also update the team's members list
      setTeams(teams.map(team => 
        team.id === teamId 
          ? { ...team, members: [...team.members, 'current_user'] }
          : team
      ));
    }
    setShowJoinModal(false);
  };

  const handleLeaveTeam = (teamId) => {
    setUserTeams(userTeams.filter(id => id !== teamId));
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { ...team, members: team.members.filter(member => member !== 'current_user') }
        : team
    ));
  };

  const myTeams = teams.filter(team => userTeams.includes(team.id));
  const availableTeams = teams.filter(team => !userTeams.includes(team.id));

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
                          {team.members.length} members
                        </Badge>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <p className="text-muted">{team.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted">Team Points</small>
                          <div className="fw-bold text-primary">{team.totalPoints}</div>
                        </div>
                        <div>
                          <small className="text-muted">Captain</small>
                          <div className="fw-bold">{team.captain}</div>
                        </div>
                      </div>
                    </Card.Body>
                    <Card.Footer>
                      <div className="d-flex justify-content-between">
                        <Button variant="outline-primary" size="sm">
                          View Details
                        </Button>
                        {team.captain !== 'current_user' && (
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleLeaveTeam(team.id)}
                          >
                            Leave Team
                          </Button>
                        )}
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
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Team
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
                      <p className="mb-1 text-muted">{team.description}</p>
                      <div className="d-flex gap-3">
                        <small className="text-muted">
                          Captain: <span className="fw-bold">{team.captain}</span>
                        </small>
                        <small className="text-muted">
                          Members: <span className="fw-bold">{team.members.length}</span>
                        </small>
                        <small className="text-muted">
                          Points: <span className="fw-bold text-primary">{team.totalPoints}</span>
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