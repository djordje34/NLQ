import React from 'react';

const Home = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="container">
      <h1>Welcome to the Home Page bla bla</h1>
      <button className="btn btn-dark" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Home;
