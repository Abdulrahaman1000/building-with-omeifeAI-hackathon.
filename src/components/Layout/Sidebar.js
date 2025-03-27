import React from 'react';
import { Nav, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { 
  Home, 
  User, 
  Settings, 
  HelpCircle, 
  Book, 
  LogOut, 
  Layers, 
  Globe 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  
  const handleLinkClick = () => {
    // Close sidebar on mobile after link click
    if (onClose) {
      onClose();
    }
  };

  return (
    <Card 
      className="h-100 shadow-sm border-0" 
      style={{ backgroundColor: '#f8f9fa' }}
    >
      <Card.Body className="p-0">
        {/* User Profile Section */}
        <div className="p-4 text-center border-bottom">
          <div 
            className="mx-auto rounded-circle mb-3" 
            style={{
              width: '80px', 
              height: '80px', 
              backgroundColor: '#e9ecef',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <User size={40} className="text-muted" />
          </div>
          <h5 className="mb-1">{user?.name || 'User'}</h5>
          <p className="text-muted small mb-0">{user?.email || 'user@example.com'}</p>
        </div>

        {/* Navigation Links */}
        <Nav className="flex-column p-3">
          <LinkContainer to="/dashboard" className="mb-2" onClick={handleLinkClick}>
            <Nav.Link className="d-flex align-items-center">
              <Home className="me-3" size={20} />
              Dashboard
            </Nav.Link>
          </LinkContainer>

          <LinkContainer to="/profile" className="mb-2" onClick={handleLinkClick}>
            <Nav.Link className="d-flex align-items-center">
              <User className="me-3" size={20} />
              Profile
            </Nav.Link>
          </LinkContainer>

          <LinkContainer to="/services" className="mb-2" onClick={handleLinkClick}>
            <Nav.Link className="d-flex align-items-center">
              <Layers className="me-3" size={20} />
              Services
            </Nav.Link>
          </LinkContainer>

          <LinkContainer to="/translations" className="mb-2" onClick={handleLinkClick}>
            <Nav.Link className="d-flex align-items-center">
              <Globe className="me-3" size={20} />
              Translations
            </Nav.Link>
          </LinkContainer>

          <LinkContainer to="/settings" className="mb-2" onClick={handleLinkClick}>
            <Nav.Link className="d-flex align-items-center">
              <Settings className="me-3" size={20} />
              Settings
            </Nav.Link>
          </LinkContainer>

          <LinkContainer to="/help" className="mb-2" onClick={handleLinkClick}>
            <Nav.Link className="d-flex align-items-center">
              <HelpCircle className="me-3" size={20} />
              Help & Support
            </Nav.Link>
          </LinkContainer>

          <LinkContainer to="/about" className="mb-2" onClick={handleLinkClick}>
            <Nav.Link className="d-flex align-items-center">
              <Book className="me-3" size={20} />
              About
            </Nav.Link>
          </LinkContainer>

          {/* Logout Button */}
          <Nav.Item className="mt-3 border-top pt-3">
            <button 
              onClick={() => {
                handleLinkClick();
                logout();
              }} 
              className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
            >
              <LogOut className="me-2" size={20} />
              Logout
            </button>
          </Nav.Item>
        </Nav>
      </Card.Body>
    </Card>
  );
}