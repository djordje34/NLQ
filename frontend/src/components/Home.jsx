import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaCode, FaLanguage } from 'react-icons/fa';
import logo from '../imgs/banner.png'
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
          <h2>Query your SQL database - without worrying about syntax 💻</h2>
          <h5>Ready for a smoother, more intuitive SQL experience? Let's get started!</h5>
          <div style={{ position: 'relative',marginTop:'15px' }}>
          <img src={logo} alt="Logo" style={{ maxWidth: '100%', height: 'auto' }} />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: '#fff',
            }}
          >
            <h2 style={{ fontSize: '2.5em' }}>NLQ</h2>
            <p
              style={{
                fontSize: '1.2em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeScaleIn 2s ease-in-out'
              }}
            >
              <FaCode style={{ marginRight: '10px', animation: 'bounce 2s infinite' }} />
              Natural Language Querying
              <FaCode style={{ marginLeft: '10px', animation: 'bounce 2s infinite' }} />
            </p>
          </div>
        </div>
          <hr/>
          <h3>Table of Contents</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              <a href="#welcome-section" style={{  textDecoration: 'none', fontSize: '18px' }}>Welcome</a>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <a href="#key-features-section" style={{textDecoration: 'none', fontSize: '18px' }}>Key Features</a>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <a href="#getting-started-section" style={{textDecoration: 'none', fontSize: '18px' }}>Getting Started</a>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <a href="#example-usage-section" style={{textDecoration: 'none', fontSize: '18px' }}>Example Usage</a>
            </li>
            <li style={{ marginBottom: '8px' }}>
              <a href="#additional-info-section" style={{textDecoration: 'none', fontSize: '18px' }}>Additional Information</a>
            </li>
          </ul>

          <hr id="welcome-section" />

          <h3>Welcome</h3>
          <p>
          Welcome to the NLQ project! 🌐🚀 This innovative platform is designed to revolutionize your database interactions by seamlessly integrating Natural Language Queries (NLQ).
        </p>
        <p>
          Say goodbye to complex syntax and tedious commands. With NLQ, you can effortlessly interact with your SQL database using everyday language.
        </p>

          <hr id="key-features-section" />

          <h3>Key Features:</h3>
          <ul>
          <li>Intuitive Natural Language Queries 🗣️</li>
          <p>Interact with your database using simple and natural language, making it accessible to everyone.</p>

          <li>Syntax-Free SQL Interaction 🚀</li>
          <p>Say goodbye to complex SQL syntax! NLQ handles the translation, allowing you to focus on your queries without the syntax headache.</p>

          <li>User-Friendly Dashboard 🖥️</li>
          <p>Explore a sleek and user-friendly dashboard that simplifies database management. Easily navigate through your data and queries.</p>
          </ul>
                  <hr id="getting-started-section" />
          <h3>Getting Started:</h3>
          <ol>
            <li>Create an account by registering.</li>
            <li>Login to your account.</li>
            <li>Explore the databases section to manage your data.</li>
            <li>Use the query tool to interact with your SQL database.</li>
          </ol>
          <hr id="example-usage-section" />
          <h3>Example Usage:</h3>
          <h4>User Input (Query):</h4>
          <code>Who are the two employees with the highest salaries?</code>

          <h4>Processing Steps:</h4>
          <ol>
            <li>🔍 Convert NL Query to SQL:</li>
            <code>SELECT * FROM employees ORDER BY salary DESC LIMIT 2;</code>

            <li>⚙️ Execute SQL Query on the Database and Retrieve Results.</li>

            <li>🔄 Convert SQL Result to NL Response:</li>
            <ul>
              <li><code>Name: John Doe, Salary: $120,000</code></li>
              <li><code>Name: Jane Smith, Salary: $110,000</code></li>
            </ul>
          </ol>
          <h4>
            Output (Result):
          </h4>
          <p>Displaying information about employees with the highest salaries:</p>
            <ul>
              <li>Name: John Doe, Salary: $120,000</li>
              <li>Name: Jane Smith, Salary: $110,000</li>
            </ul>
            <hr id="additional-info-section" />
          <h4>Additional Information:</h4>
          <p>
            Here are some additional details about the NLQ tool:
          </p>
          <table className="table table-bordered table-dark">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>GitHub Repository</td>
                <td>
                  <a href="https://github.com/djordje34/PY-NLQ" target="_blank" rel="noopener noreferrer">
                    <FaGithub size={20} style={{ marginRight: '5px' }} />
                  </a>
                  <a href="https://github.com/djordje34/PY-NLQ" target="_blank" rel="noopener noreferrer">
                    Star the repository ⭐
                  </a>
                </td>
              </tr>
              <tr>
                <td>LinkedIn</td>
                <td>
                  <a href="https://www.linkedin.com/in/djordjekarisic/" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin size={20} style={{ marginRight: '5px' }} />
                  </a>
                  <a href="https://www.linkedin.com/in/djordjekarisic/" target="_blank" rel="noopener noreferrer">
                    Connect with me on LinkedIn 🔗
                  </a>
                </td>
              </tr>
              <tr>
                <td>Version</td>
                <td>1.0.0</td>
              </tr>
              <tr>
                <td>License</td>
                <td>Apache-2.0 license</td>
              </tr>
            </tbody>
          </table>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Home;
