import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import api from '../api';

const Login = ({ onLogin }) => {
  const history = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = async () => {
    try {
      const response = await api.post('/users/login', credentials);
      const { token } = response.data;
      localStorage.setItem('token', token);
      onLogin();
      history.push('/home');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed 😔. Please check your credentials.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
        });
    }
  };

  return (
    <div className="container" data-bs-theme="light">
      <h2>Glad to see you again!</h2>
      <Form>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
        </Form.Group>

        <Button variant="dark" onClick={handleLogin}>
          Login
        </Button>
      </Form>
      <div className="mt-3 brm">
        Don't have an account? <Link className='link-dark' to="/register">Register here</Link>.
      </div>
      <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      />
    </div>
  );
};

export default Login;
