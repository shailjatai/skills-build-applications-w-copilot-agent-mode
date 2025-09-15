import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Tabs, Tab, Badge, ProgressBar } from 'react-bootstrap';

function Leaderboard() {
  const [activeTab, setActiveTab] = useState('individual');

  const individualLeaderboard = [
    { rank: 1, name: 'Alex Garcia', points: 1250, activities: 25, avatar: '👨‍💼' },
    { rank: 2, name: 'Sarah Wilson', points: 1180, activities: 22, avatar: '👩‍🎓' },
    { rank: 3, name: 'Mike Johnson', points: 1150, activities: 28, avatar: '👨‍🏫' },
    { rank: 4, name: 'Emma Davis', points: 1100, activities: 20, avatar: '👩‍💻' },
    { rank: 5, name: 'John Doe', points: 1050, activities: 24, avatar: '👨‍🔬' },
    { rank: 6, name: 'Jane Smith', points: 980, activities: 19, avatar: '👩‍🏭' },
    { rank: 7, name: 'Chris Lee', points: 920, activities: 18, avatar: '👨‍🎨' },
    { rank: 8, name: 'Lisa Taylor', points: 880, activities: 17, avatar: '👩‍⚕️' },
    { rank: 9, name: 'David Brown', points: 850, activities: 16, avatar: '👨‍🍳' },
    { rank: 10, name: 'You', points: 800, activities: 15, avatar: '👤', isCurrentUser: true }
  ];

  const teamLeaderboard = [
    { rank: 1, name: 'Fitness Warriors', points: 2850, members: 8, captain: 'Alex Garcia' },
    { rank: 2, name: 'Cardio Crew', points: 2650, members: 6, captain: 'Sarah Wilson' },
    { rank: 3, name: 'Strength Squad', points: 2400, members: 7, captain: 'Mike Johnson' },
    { rank: 4, name: 'Yoga Masters', points: 2200, members: 5, captain: 'Emma Davis' },
    { rank: 5, name: 'Running Club', points: 2050, members: 9, captain: 'John Doe' }
  ];

  const getRankBadge = (rank) => {
    if (rank === 1) return <Badge bg="warning">🥇 {rank}</Badge>;
    if (rank === 2) return <Badge bg="secondary">🥈 {rank}</Badge>;
    if (rank === 3) return <Badge bg="danger">🥉 {rank}</Badge>;
    return <Badge bg="primary">{rank}</Badge>;
  };

  const getPointsProgress = (points, maxPoints = 1250) => {
    return (points / maxPoints) * 100;
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary">Leaderboard</h2>
          <p className="text-muted">See how you rank against other students and teams!</p>
        </Col>
      </Row>

      {/* Top 3 Podium */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-light">
            <Card.Body>
              <h4 className="text-center mb-4">🏆 Top Performers</h4>
              <Row className="text-center">
                {/* 2nd Place */}
                <Col md={4} className="mb-3">
                  <div className="position-relative">
                    <div className="bg-secondary text-white rounded-circle mx-auto d-flex align-items-center justify-content-center" 
                         style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                      {individualLeaderboard[1].avatar}
                    </div>
                    <Badge bg="secondary" className="position-absolute" style={{top: '-10px', right: '25%'}}>
                      🥈 2nd
                    </Badge>
                  </div>
                  <h5 className="mt-3">{individualLeaderboard[1].name}</h5>
                  <p className="text-primary fw-bold">{individualLeaderboard[1].points} points</p>
                </Col>
                
                {/* 1st Place */}
                <Col md={4} className="mb-3">
                  <div className="position-relative">
                    <div className="bg-warning text-white rounded-circle mx-auto d-flex align-items-center justify-content-center" 
                         style={{width: '100px', height: '100px', fontSize: '2.5rem'}}>
                      {individualLeaderboard[0].avatar}
                    </div>
                    <Badge bg="warning" className="position-absolute" style={{top: '-10px', right: '20%'}}>
                      🥇 1st
                    </Badge>
                    <div className="mt-2">
                      <i className="fas fa-crown text-warning fa-2x"></i>
                    </div>
                  </div>
                  <h4 className="mt-3">{individualLeaderboard[0].name}</h4>
                  <p className="text-warning fw-bold fs-5">{individualLeaderboard[0].points} points</p>
                </Col>
                
                {/* 3rd Place */}
                <Col md={4} className="mb-3">
                  <div className="position-relative">
                    <div className="bg-danger text-white rounded-circle mx-auto d-flex align-items-center justify-content-center" 
                         style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                      {individualLeaderboard[2].avatar}
                    </div>
                    <Badge bg="danger" className="position-absolute" style={{top: '-10px', right: '25%'}}>
                      🥉 3rd
                    </Badge>
                  </div>
                  <h5 className="mt-3">{individualLeaderboard[2].name}</h5>
                  <p className="text-primary fw-bold">{individualLeaderboard[2].points} points</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Leaderboard Tabs */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
              >
                <Tab eventKey="individual" title="Individual Leaderboard">
                  <Table responsive hover>
                    <thead className="table-primary">
                      <tr>
                        <th>Rank</th>
                        <th>Student</th>
                        <th>Points</th>
                        <th>Activities</th>
                        <th>Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {individualLeaderboard.map((student) => (
                        <tr 
                          key={student.rank} 
                          className={student.isCurrentUser ? 'table-info' : ''}
                        >
                          <td>{getRankBadge(student.rank)}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="me-2" style={{fontSize: '1.5rem'}}>
                                {student.avatar}
                              </span>
                              <div>
                                <strong className={student.isCurrentUser ? 'text-primary' : ''}>
                                  {student.name}
                                  {student.isCurrentUser && <span className="ms-2">👈</span>}
                                </strong>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge bg="primary" className="fs-6">
                              {student.points}
                            </Badge>
                          </td>
                          <td>{student.activities}</td>
                          <td style={{width: '200px'}}>
                            <ProgressBar 
                              now={getPointsProgress(student.points)} 
                              variant={student.rank <= 3 ? 'success' : 'primary'}
                              style={{height: '8px'}}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab>

                <Tab eventKey="teams" title="Team Leaderboard">
                  <Table responsive hover>
                    <thead className="table-success">
                      <tr>
                        <th>Rank</th>
                        <th>Team Name</th>
                        <th>Total Points</th>
                        <th>Members</th>
                        <th>Captain</th>
                        <th>Avg Points/Member</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamLeaderboard.map((team) => (
                        <tr key={team.rank}>
                          <td>{getRankBadge(team.rank)}</td>
                          <td>
                            <strong>{team.name}</strong>
                          </td>
                          <td>
                            <Badge bg="success" className="fs-6">
                              {team.points}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg="info">
                              {team.members} members
                            </Badge>
                          </td>
                          <td>{team.captain}</td>
                          <td>{Math.round(team.points / team.members)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Stats Summary */}
      <Row className="mt-4">
        <Col md={4}>
          <Card className="text-center border-primary">
            <Card.Body>
              <h5 className="text-primary">Your Current Rank</h5>
              <h2 className="text-primary">#10</h2>
              <p className="text-muted mb-0">Out of 50 students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center border-success">
            <Card.Body>
              <h5 className="text-success">Points to Next Rank</h5>
              <h2 className="text-success">50</h2>
              <p className="text-muted mb-0">Keep going! 🚀</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center border-warning">
            <Card.Body>
              <h5 className="text-warning">School Record</h5>
              <h2 className="text-warning">1,250</h2>
              <p className="text-muted mb-0">Points by Alex Garcia</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Leaderboard;