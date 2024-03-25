import React, { useState } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import CustomNavbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Databases from './components/Databases';
import Queries from './components/Queries'
import GenerateDatabase from './components/GenerateDatabase';
import Settings from './components/Settings'
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
            element={isLoggedIn ? <Navigate to="/" /> : <><div id="auth-container" className=''><Login onLogin={handleLogin} /></div><div></div></>}
          />
          <Route
            path="/register"
            element={isLoggedIn ? <Navigate to="/" /> : <><div id="auth-container"><Register /></div><div></div></>}
          />
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/databases"
            element={isLoggedIn ? <Databases isLoggedIn={isLoggedIn} /> : <Navigate to="/login" />}
          />
          <Route 
          path="/queries/:databaseId" 
          element={<Queries/>}
          />
          <Route 
          path="/generate" 
          element={<GenerateDatabase/>}
          />
          <Route 
          path="/settings" 
          element={<Settings/>}
          />
        </Routes>
    </Router>
  );
};

export default App;
