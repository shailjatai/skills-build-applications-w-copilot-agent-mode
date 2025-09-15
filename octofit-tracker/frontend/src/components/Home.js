import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import octofitLogo from '../octofitapp-small.png';

function Home() {
  return (
    <Container>
      <Row className="text-center mb-5">
        <Col>
          <img 
            src={octofitLogo} 
            alt="OctoFit Tracker" 
            width="120" 
            height="120" 
            className="mb-3"
          />
          <h1 className="display-4 text-primary">Welcome to OctoFit Tracker</h1>
          <p className="lead">
            Track your fitness journey, compete with teams, and achieve your wellness goals!
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className="fas fa-dumbbell fa-3x text-primary"></i>
              </div>
              <Card.Title>Track Activities</Card.Title>
              <Card.Text>
                Log your workouts, runs, and fitness activities. Earn points and track your progress over time.
              </Card.Text>
              <Button as={Link} to="/activities" variant="primary">
                Start Tracking
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className="fas fa-users fa-3x text-success"></i>
              </div>
              <Card.Title>Join Teams</Card.Title>
              <Card.Text>
                Create or join fitness teams. Compete with classmates and motivate each other to stay active.
              </Card.Text>
              <Button as={Link} to="/teams" variant="success">
                View Teams
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className="fas fa-trophy fa-3x text-warning"></i>
              </div>
              <Card.Title>Compete & Win</Card.Title>
              <Card.Text>
                Check your ranking on the leaderboard. See how you stack up against other students and teams.
              </Card.Text>
              <Button as={Link} to="/leaderboard" variant="warning">
                View Leaderboard
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <Card className="bg-light">
            <Card.Body>
              <h3 className="text-center mb-4">How It Works</h3>
              <Row>
                <Col md={3} className="text-center mb-3">
                  <div className="mb-2">
                    <i className="fas fa-user-plus fa-2x text-primary"></i>
                  </div>
                  <h5>1. Sign Up</h5>
                  <p>Create your profile and set your fitness goals</p>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <div className="mb-2">
                    <i className="fas fa-running fa-2x text-primary"></i>
                  </div>
                  <h5>2. Track Activities</h5>
                  <p>Log your workouts and earn points for staying active</p>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <div className="mb-2">
                    <i className="fas fa-users fa-2x text-primary"></i>
                  </div>
                  <h5>3. Join Teams</h5>
                  <p>Connect with friends and compete together</p>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <div className="mb-2">
                    <i className="fas fa-medal fa-2x text-primary"></i>
                  </div>
                  <h5>4. Achieve Goals</h5>
                  <p>Reach milestones and climb the leaderboard</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="text-center">
        <Col>
          <Button as={Link} to="/dashboard" variant="primary" size="lg">
            Get Started Now
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;