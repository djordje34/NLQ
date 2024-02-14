import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import api from '../api';

const Register = () => {
  const history = useNavigate();
  const [userInfo, setUserInfo] = useState({ username: '', password: '' });

  const handleRegister = async () => {
    try {
      await api.post('/register', userInfo);
      history.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="container">
      <h2>Welcome!</h2>
      <Form>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Choose a username"
            value={userInfo.username}
            onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Choose a password"
            value={userInfo.password}
            onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
          />
        </Form.Group>
        <Button variant="dark" onClick={handleRegister}>
          Register
        </Button>
      </Form>
      <div className="mt-3 brm">
        Already have an account? <Link className='link-dark' to="/login">Login here</Link>.
      </div>
    </div>
  );
};

export default Register;
