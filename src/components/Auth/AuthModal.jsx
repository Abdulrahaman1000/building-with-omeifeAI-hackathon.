import React, { useState } from 'react';
import { Modal, Tab, Tabs, Container, Row, Col } from 'react-bootstrap';
import LoginForm from '../Auth/Login';
import RegisterForm from '../Auth/Register';

export default function AuthModal({ show, onHide }) {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      size="lg"
      dialogClassName="auth-modal"
    >
      <Modal.Header 
        closeButton 
        className="border-bottom-0 pb-0"
      >
        <Modal.Title className="w-100 text-center">
          <h2 className="fw-bold">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="text-muted">
            {activeTab === 'login' 
              ? 'Sign in to continue to your dashboard' 
              : 'Join our community today'}
          </p>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Container>
          <Row>
            <Col>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="nav-fill nav-tabs-bordered mb-4"
              >
                <Tab 
                  eventKey="login" 
                  title={
                    <div className="d-flex flex-column align-items-center">
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Sign In
                    </div>
                  }
                >
                  <LoginForm onSuccess={onHide} />
                </Tab>
                <Tab 
                  eventKey="register" 
                  title={
                    <div className="d-flex flex-column align-items-center">
                      <i className="bi bi-person-plus me-2"></i>
                      Register
                    </div>
                  }
                >
                  <RegisterForm onSuccess={onHide} />
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      
      <Modal.Footer className="justify-content-center border-top-0 pt-0">
        <div className="text-center">
          <p className="text-muted">
            {activeTab === 'login' 
              ? "Don't have an account? " 
              : "Already have an account? "}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(activeTab === 'login' ? 'register' : 'login');
              }} 
              className="fw-bold text-primary"
            >
              {activeTab === 'login' ? 'Sign Up' : 'Sign In'}
            </a>
          </p>
        </div>
      </Modal.Footer>

      <style jsx global>{`
        .auth-modal .modal-content {
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .nav-tabs-bordered .nav-link {
          border: none;
          color: #6c757d;
        }
        .nav-tabs-bordered .nav-link.active {
          color: #007bff;
          border-bottom: 2px solid #007bff;
        }
      `}</style>
    </Modal>
  );
}