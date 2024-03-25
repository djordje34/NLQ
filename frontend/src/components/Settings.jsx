import React, { useState, useEffect } from 'react';
import { Form, Button, Container, ListGroup, Modal, Spinner } from 'react-bootstrap';
import api from '../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Settings = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
  
    useEffect(() => {
      fetchUserData();
    }, []);
  
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/users`,{
            headers: {
              Authorization: `${localStorage.getItem('token')}`,
            },
          });
        if (!response.statusText == 'OK') {
          throw new Error('Failed to fetch user data');
        }
        const userData = response.data;
        setUsername(userData.username);
        if (userData.email) {
          setEmail(userData.email);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const response = await fetch('/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, email }),
        });
        if (!response.ok) {
          throw new Error('Failed to save changes');
        }
        console.log('Changes saved successfully');
      } catch (error) {
        console.error('Error:', error.message);
      }
    };
  
    return (
    <div className='dashboard' style={{minHeight:'94.4vh'}}>
      <Container className='d-flex flex-column'>
        <h2>Account Settings</h2>
        <Form onSubmit={handleSubmit} style={{width:'30%', minWidth:'30ch'}}>
          <Form.Group controlId="formUsername" className='my-4'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
  
          <Form.Group controlId="formPassword" className='my-4'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
  
          <Form.Group controlId="formEmail" className='my-4'>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter new email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
  
          <Button variant="dark" className='importBtn' type="submit">
            Save Changes
          </Button>
        </Form>
      </Container>
    </div>
    );
  };

export default Settings;