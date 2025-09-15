import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import octofitLogo from '../octofitapp-small.png';

function Navigation() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={octofitLogo}
            width="40"
            height="40"
            className="d-inline-block align-top me-2"
            alt="OctoFit Tracker Logo"
          />
          OctoFit Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/activities">Activities</Nav.Link>
            <Nav.Link as={Link} to="/teams">Teams</Nav.Link>
            <Nav.Link as={Link} to="/leaderboard">Leaderboard</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;