import React, { useState } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import CustomNavbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import './App.css'

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
    <Router>
        <CustomNavbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/home" /> : <div id="auth-container"><Login onLogin={handleLogin} /></div>}
          />
          <Route
            path="/register"
            element={isLoggedIn ? <Navigate to="/home" /> : <div id="auth-container"><Register /></div>}
          />
          <Route
            path="/home"
            element={isLoggedIn ? <div id="auth-container"><Home /></div> : <Navigate to="/login" />}
          />
        </Routes>
    </Router>
  );
};

export default App;


