import { Button, Container, Card, Row, Col, Alert, Badge, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import AuthModal from '../Auth/AuthModal';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Key, Volume2, Languages, User, LogIn, Star } from 'lucide-react';

export default function LandingPage() {
  const { user, login } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [showDemoAlert, setShowDemoAlert] = useState(true);

  // Auto-login demo account
  const handleDemoLogin = async () => {
    try {
      await login({
        email: "ibrahimraji1257@gmail.com",
        password: "ibrahimraji1257"
      });
    } catch (error) {
      console.error("Demo login failed:", error);
    }
  };

  // Show welcome popup on first login
  useEffect(() => {
    if (user && !localStorage.getItem('hasSeenWelcome')) {
      setShowWelcomePopup(true);
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, [user]);

  return (
    <div className="bg-light">
      {/* Hero Section */}
      <div 
        className="py-5 text-white" 
        style={{
          background: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite'
        }}
      >
        <Container className="text-center py-5">
          <h1 className="display-3 fw-bold mb-3">
            <span className="text-primary">Omeife</span> AI Platform
          </h1>
          <p className="lead mb-4">
            Advanced Language Processing & Translation Services
          </p>
          
          <div className="d-flex justify-content-center gap-3">
            {!user ? (
              <>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 shadow"
                >
                  <LogIn size={20} className="me-2" />
                  Get Started
                </Button>
                <Button 
                  variant="outline-light" 
                  size="lg"
                  onClick={handleDemoLogin}
                  className="px-4 py-2 shadow"
                >
                  <User size={20} className="me-2" />
                  Try Demo
                </Button>
              </>
            ) : (
              <Button 
                variant="success" 
                size="lg"
                href="/dashboard"
                className="px-4 py-2 shadow"
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </Container>
      </div>

      {/* Demo Credentials Card */}
      {showDemoAlert && (
        <Container className="mt-4">
          <Alert variant="info" onClose={() => setShowDemoAlert(false)} dismissible>
            <Alert.Heading className="d-flex align-items-center">
              <Star size={20} className="me-2" />
              Demo Access
            </Alert.Heading>
            <p className="mb-2">
              Use these credentials to explore the platform:
            </p>
            <div className="bg-white p-3 rounded mb-3">
              <div><strong>Email:</strong> ibrahimraji1257@gmail.com</div>
              <div><strong>Password:</strong> ibrahimraji1257</div>
            </div>
            <Button variant="outline-info" size="sm" onClick={handleDemoLogin}>
              Auto-login to Demo Account
            </Button>
          </Alert>
        </Container>
      )}

      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center mb-5">Powerful Features</h2>
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center">
                <div 
                  className="d-flex align-items-center justify-content-center mx-auto mb-3" 
                  style={{
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)'
                  }}
                >
                  <Languages size={32} className="text-primary" />
                </div>
                <Card.Title>Real-time Translation</Card.Title>
                <Card.Text className="text-muted">
                  Seamlessly translate between multiple languages with our advanced AI models.
                </Card.Text>
                <Badge bg="primary" className="mt-2">Try Now</Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center">
                <div 
                  className="d-flex align-items-center justify-content-center mx-auto mb-3" 
                  style={{
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%',
                    backgroundColor: 'rgba(25, 135, 84, 0.1)'
                  }}
                >
                  <Volume2 size={32} className="text-success" />
                </div>
                <Card.Title>Speech Transcription</Card.Title>
                <Card.Text className="text-muted">
                  Convert audio to text with industry-leading accuracy and speed.
                </Card.Text>
                <Badge bg="success" className="mt-2">New</Badge>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center">
                <div 
                  className="d-flex align-items-center justify-content-center mx-auto mb-3" 
                  style={{
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)'
                  }}
                >
                  <Key size={32} className="text-warning" />
                </div>
                <Card.Title>API Access</Card.Title>
                <Card.Text className="text-muted">
                  Integrate our services directly into your applications with developer APIs.
                </Card.Text>
                <Badge bg="warning" className="mt-2">Dev Tools</Badge>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Auth Modal */}
      <AuthModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
      />

      {/* Welcome Popup Modal */}
      <Modal 
        show={showWelcomePopup} 
        onHide={() => setShowWelcomePopup(false)}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="d-flex align-items-center">
            <CheckCircle className="text-success me-2" size={24} />
            Welcome {user?.name || 'User'}!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <Key className="text-primary me-2" size={20} />
                    <h5 className="mb-0">Your API Key</h5>
                  </div>
                  <Card.Text className="text-muted">
                    We've automatically generated your API key. Access it anytime from your dashboard.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <User className="text-primary me-2" size={20} />
                    <h5 className="mb-0">Demo Account Active</h5>
                  </div>
                  <Card.Text className="text-muted">
                    You're currently using our demo account. Sign up to create your personal account.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button 
            variant="primary" 
            onClick={() => setShowWelcomePopup(false)}
            className="px-4"
          >
            Start Exploring
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add the gradient animation */}
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
}