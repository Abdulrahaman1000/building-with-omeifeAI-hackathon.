import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Row, Col, Offcanvas } from 'react-bootstrap';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar'; // Adjust the import path as needed

function Layout() {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);

  return (
    <Container fluid className="p-0">
      {/* Mobile Header */}
      <div className="d-md-none bg-light py-2 px-3 d-flex justify-content-between align-items-center">
        <h1 className="h4 mb-0">My App</h1>
        <button 
          className="btn btn-outline-primary" 
          onClick={toggleSidebar}
        >
          {showSidebar ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Offcanvas */}
      <Offcanvas 
        show={showSidebar} 
        onHide={closeSidebar} 
        responsive="md"
        className="d-md-none" // Add this to hide on desktop
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <Sidebar onClose={closeSidebar} />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Layout */}
      <Row className="g-0">
        {/* Desktop Sidebar */}
        <Col 
          md={3} 
          lg={2} 
          className="d-none d-md-block"
        >
          <Sidebar />
        </Col>

        {/* Main Content Area */}
        <Col 
          xs={12} 
          md={9} 
          lg={10} 
          className="p-3 p-md-4"
        >
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

export default Layout;