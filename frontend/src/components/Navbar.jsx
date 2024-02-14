import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './index.css'

const CustomNavbar = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container style={{ margin: '0px' }}>
        <Navbar.Brand as={NavLink} to="/home">
          NLQ
        </Navbar.Brand>
        <Nav className="me-auto">
          {!isLoggedIn && (
            <>
            <Nav.Link as={NavLink} to="/home" className="nav-link">
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/login" className="nav-link">
                Login
              </Nav.Link>
              <Nav.Link as={NavLink} to="/register" className="nav-link">
                Register
              </Nav.Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <Nav.Link as={NavLink} to="/home" className="nav-link">
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/databases" className="nav-link">
                Databases
              </Nav.Link>
              <Nav.Link as={NavLink} to="/settings" className="nav-link">
                Settings
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;

