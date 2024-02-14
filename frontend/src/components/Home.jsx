import React from 'react';

const Home = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="dashboard">
      <div className='greeter'>
        <div>
        <h2>Query your SQL database - without worrying about syntax 💻🚀</h2>
        <p>Welcome to our SQL Query tool! Simplify your database interactions with NLQ.</p>
        <p>Say goodbye to complex SQL syntax and hours of debugging. Focus on what you want to achieve.</p>
        <p>No more deciphering error messages or struggling with JOIN syntax. Let's revolutionize database queries.</p>
        <p>Ready for a smoother, more intuitive SQL experience?</p>
        <p>Let's get started!</p>
        </div>
        </div>
      {isLoggedIn && <button className="btn btn-dark" onClick={handleLogout}>
        Logout
      </button>}
    </div>
  );
};

export default Home;
