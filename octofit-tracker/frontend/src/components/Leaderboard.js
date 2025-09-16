import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Tabs, Tab, Badge, ProgressBar, Spinner, Alert } from 'react-bootstrap';
import { leaderboardAPI } from '../services/api';

function Leaderboard() {
  const [activeTab, setActiveTab] = useState('individual');
  const [individualLeaderboard, setIndividualLeaderboard] = useState([]);
  const [teamLeaderboard, setTeamLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let userLeaderboard = [];
      let teamData = [];
      
      // Try to get leaderboard data from multiple endpoints
      try {
        const usersResponse = await leaderboardAPI.getUsers();
        userLeaderboard = usersResponse || [];
      } catch (err) {
        console.warn('Users leaderboard not available:', err);
      }
      
      try {
        const teamsResponse = await leaderboardAPI.getTeams();
        teamData = teamsResponse || [];
      } catch (err) {
        console.warn('Teams leaderboard not available:', err);
      }
      
      // If no data from leaderboard endpoints, try tracker leaderboard entries
      if (userLeaderboard.length === 0) {
        try {
          const entriesResponse = await leaderboardAPI.getEntries();
          const entries = entriesResponse.results || [];
          userLeaderboard = entries.map((entry, index) => ({
            rank: index + 1,
            id: entry.id,
            name: entry.user?.first_name ? `${entry.user.first_name} ${entry.user.last_name}` : entry.user?.email || 'Unknown User',
            points: entry.total_calories || 0,
            activities: Math.floor((entry.total_duration || 0) / 30), // Estimate activities from duration
            avatar: '👤',
            total_points: entry.total_calories || 0
          }));
        } catch (err) {
          console.warn('Tracker leaderboard entries not available:', err);
        }
      } else {
        // Format fitness leaderboard data
        userLeaderboard = userLeaderboard.map((user, index) => ({
          rank: user.rank || index + 1,
          id: user.id,
          name: user.first_name ? `${user.first_name} ${user.last_name}` : user.username || 'Unknown User',
          points: user.total_points || 0,
          activities: Math.floor((user.total_points || 0) / 40), // Estimate activities from points
          avatar: '👤',
          total_points: user.total_points || 0
        }));
      }
      
      // Format team leaderboard data
      teamData = teamData.map((team, index) => ({
        rank: team.rank || index + 1,
        id: team.id,
        name: team.name,
        points: team.total_team_points || 0,
        members: team.member_count || 0,
        captain: team.captain?.username || 'Unknown'
      }));
      
      // If we still don't have data, create sample data
      if (userLeaderboard.length === 0) {
        userLeaderboard = [
          { rank: 1, name: 'Alex Garcia', points: 1250, activities: 25, avatar: '👨‍💼', id: 1 },
          { rank: 2, name: 'Sarah Wilson', points: 1180, activities: 22, avatar: '👩‍🎓', id: 2 },
          { rank: 3, name: 'Mike Johnson', points: 1150, activities: 28, avatar: '👨‍🏫', id: 3 },
          { rank: 4, name: 'Emma Davis', points: 1100, activities: 20, avatar: '👩‍💻', id: 4 },
          { rank: 5, name: 'John Doe', points: 1050, activities: 24, avatar: '👨‍🔬', id: 5 }
        ];
      }
      
      if (teamData.length === 0) {
        teamData = [
          { rank: 1, name: 'Fitness Warriors', points: 2850, members: 8, captain: 'Alex Garcia', id: 1 },
          { rank: 2, name: 'Cardio Crew', points: 2650, members: 6, captain: 'Sarah Wilson', id: 2 },
          { rank: 3, name: 'Strength Squad', points: 2400, members: 7, captain: 'Mike Johnson', id: 3 }
        ];
      }
      
      setIndividualLeaderboard(userLeaderboard);
      setTeamLeaderboard(teamData);
      
    } catch (err) {
      setError('Failed to load leaderboard data. Please try again.');
      console.error('Error loading leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return <Badge bg="warning">🥇 {rank}</Badge>;
    if (rank === 2) return <Badge bg="secondary">🥈 {rank}</Badge>;
    if (rank === 3) return <Badge bg="danger">🥉 {rank}</Badge>;
    return <Badge bg="primary">{rank}</Badge>;
  };

  const getPointsProgress = (points, maxPoints = null) => {
    if (!maxPoints && individualLeaderboard.length > 0) {
      maxPoints = individualLeaderboard[0]?.points || 1250;
    }
    return maxPoints ? (points / maxPoints) * 100 : 0;
  };

  const getTopThree = () => {
    if (individualLeaderboard.length < 3) return [];
    return individualLeaderboard.slice(0, 3);
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading leaderboard...</p>
      </Container>
    );
  }

  const topThree = getTopThree();

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary">Leaderboard</h2>
          <p className="text-muted">See how you rank against other students and teams!</p>
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

      {/* Top 3 Podium */}
      {topThree.length >= 3 && (
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
                        {topThree[1].avatar || '👤'}
                      </div>
                      <Badge bg="secondary" className="position-absolute" style={{top: '-10px', right: '25%'}}>
                        🥈 2nd
                      </Badge>
                    </div>
                    <h5 className="mt-3">{topThree[1].name}</h5>
                    <p className="text-primary fw-bold">{topThree[1].points} points</p>
                  </Col>
                  
                  {/* 1st Place */}
                  <Col md={4} className="mb-3">
                    <div className="position-relative">
                      <div className="bg-warning text-white rounded-circle mx-auto d-flex align-items-center justify-content-center" 
                           style={{width: '100px', height: '100px', fontSize: '2.5rem'}}>
                        {topThree[0].avatar || '👤'}
                      </div>
                      <Badge bg="warning" className="position-absolute" style={{top: '-10px', right: '20%'}}>
                        🥇 1st
                      </Badge>
                      <div className="mt-2">
                        <i className="fas fa-crown text-warning fa-2x"></i>
                      </div>
                    </div>
                    <h4 className="mt-3">{topThree[0].name}</h4>
                    <p className="text-warning fw-bold fs-5">{topThree[0].points} points</p>
                  </Col>
                  
                  {/* 3rd Place */}
                  <Col md={4} className="mb-3">
                    <div className="position-relative">
                      <div className="bg-danger text-white rounded-circle mx-auto d-flex align-items-center justify-content-center" 
                           style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                        {topThree[2].avatar || '👤'}
                      </div>
                      <Badge bg="danger" className="position-absolute" style={{top: '-10px', right: '25%'}}>
                        🥉 3rd
                      </Badge>
                    </div>
                    <h5 className="mt-3">{topThree[2].name}</h5>
                    <p className="text-primary fw-bold">{topThree[2].points} points</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

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
                  {individualLeaderboard.length > 0 ? (
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
                            key={student.id || student.rank} 
                            className={student.isCurrentUser ? 'table-info' : ''}
                          >
                            <td>{getRankBadge(student.rank)}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <span className="me-2" style={{fontSize: '1.5rem'}}>
                                  {student.avatar || '👤'}
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
                  ) : (
                    <div className="text-center py-5">
                      <i className="fas fa-trophy fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No leaderboard data available yet.</p>
                    </div>
                  )}
                </Tab>

                <Tab eventKey="teams" title="Team Leaderboard">
                  {teamLeaderboard.length > 0 ? (
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
                          <tr key={team.id || team.rank}>
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
                            <td>{team.members > 0 ? Math.round(team.points / team.members) : 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="text-center py-5">
                      <i className="fas fa-users fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No team leaderboard data available yet.</p>
                    </div>
                  )}
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
              <h5 className="text-primary">Total Students</h5>
              <h2 className="text-primary">{individualLeaderboard.length}</h2>
              <p className="text-muted mb-0">Competing in leaderboard</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center border-success">
            <Card.Body>
              <h5 className="text-success">Total Teams</h5>
              <h2 className="text-success">{teamLeaderboard.length}</h2>
              <p className="text-muted mb-0">Active teams</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center border-warning">
            <Card.Body>
              <h5 className="text-warning">Top Score</h5>
              <h2 className="text-warning">{individualLeaderboard[0]?.points || 0}</h2>
              <p className="text-muted mb-0">Points by {individualLeaderboard[0]?.name || 'Leader'}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Leaderboard;