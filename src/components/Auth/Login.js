import React, { useState } from 'react';
import { Form, Button, Alert, Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://apis.omeife.ai/api/v1/user/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      // More granular error handling
      if (!response.ok) {
        switch (response.status) {
          case 400:
            setError('Invalid input. Please check your credentials.');
            break;
          case 401:
            setError('Unauthorized. Incorrect email or password.');
            break;
          case 403:
            setError('Access forbidden. Please contact support.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError(result.message || 'Login failed');
        }
        return;
      }

      // Validate result structure
      if (!result.data || !result.data.token) {
        setError('Invalid server response');
        return;
      }

      // Use context login method
      login(result);

      // Close modal and navigate to dashboard
      onClose();
      navigate('/dashboard');

    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={12}>
          <Card className="border-0 rounded-lg">
            <Card.Body className="p-5">
              {/* <div className="text-center mb-4">
                <h2 className="fw-bold mb-3">Welcome Back</h2>
                <p className="text-muted">Sign in to continue to your dashboard</p>
              </div> */}

              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="fw-bold">Email address</Form.Label>
                  <Form.Control 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="py-2"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <div className="d-flex justify-content-between align-items-center">
                    <Form.Label className="fw-bold">Password</Form.Label>
                    <a href="#" className="text-muted small">Forgot password?</a>
                  </div>
                  <div className="position-relative">
                    <Form.Control 
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="py-2 pe-5"
                    />
                    <Button 
                      variant="link" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="position-absolute top-50 end-0 translate-middle-y border-0"
                      style={{ zIndex: 10 }}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check 
                    type="checkbox" 
                    label="Remember me" 
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 py-2 mt-3"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Form>

              {/* <div className="text-center mt-4">
                <p className="text-muted">
                  Don't have an account? <a href="#" className="fw-bold text-primary">Sign Up</a>
                </p>
              </div> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;