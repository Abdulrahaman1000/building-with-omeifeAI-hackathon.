import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Current user:', user);
  }, [user]);

  if (!user) return <div>Loading...</div>;

  // Card configuration with icons as SVG
  const cards = [
    {
      id: 'generate-api-key',
      title: 'Generate API Key',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M10 14l-5 5 2 2 4-3 2 2 5-5"/>
          <path d="M14.5 7.5 19 4l1 1-5 5"/>
        </svg>
      ),
      description: 'Create and manage your API keys',
      variant: 'primary',
      route: '/generateapi'
    },
    {
      id: 'translate',
      title: 'Translate',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
          <path d="m5 8 6 6"/>
          <path d="m4 14 6-6 2-3"/>
          <path d="M2 5h12"/>
          <path d="M7 2h1"/>
          <path d="M14 8h6"/>
          <path d="M18 5v3a2 2 0 0 1-2 2h-5l-4 4V8"/>
        </svg>
      ),
      description: 'Text and SRT Translation Services',
      variant: 'success',
      route: '/speechtranslation'
    },
    {
      id: 'knowledge-assistance',
      title: 'Knowledge Assistance',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-info">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
      description: 'Get expert insights and guidance',
      variant: 'info',
      route: '/knowledge'
    },
    {
      id: 'transcription',
      title: 'Transcription',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-danger">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" x2="12" y1="19" y2="22"/>
        </svg>
      ),
      description: 'Convert audio to text',
      variant: 'danger',
      route: '/audio'
    },
    {
      id: 'text-translation',
      title: 'Text Translation',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warning">
          <polyline points="4 7 4 4 20 4 20 7"/>
          <line x1="9" x2="15" y1="20" y2="20"/>
          <path d="M10 20a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8Z"/>
        </svg>
      ),
      description: 'Translate text between languages',
      variant: 'warning',
      route: '/texttranslation'
    },
    {
      id: 'speech-synthesis',
      title: 'Speech Synthesis',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
      ),
      description: 'Convert text to speech',
      variant: 'secondary',
      route: '/synthesis'
    },
    {
      id: 'speech-recognition',
      title: 'Speech Recognition',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dark">
          <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2z"/>
          <path d="M21 14h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2z"/>
          <path d="M6 16V9a6 6 0 0 1 12 0v7"/>
        </svg>
      ),
      description: 'Convert speech to text',
      variant: 'dark',
      route: '/dashboard/speech-recognition'
    }
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <Container fluid className="p-4">
      <h4 className="mb-4">Welcome, {user?.email || 'user@example.com'}</h4>
     
      
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {cards.map((card) => (
          <Col key={card.id}>
            <Card 
              border={card.variant} 
              className="h-100 text-center"
            >
              <Card.Body className="d-flex flex-column align-items-center">
                <div className="mb-3">{card.icon}</div>
                <Card.Title>{card.title}</Card.Title>
                <Card.Text className="text-muted">
                  {card.description}
                </Card.Text>
                <Button 
                  variant={card.variant} 
                  className="mt-auto"
                  onClick={() => handleCardClick(card.route)}
                >
                  Get Started
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default DashboardPage;