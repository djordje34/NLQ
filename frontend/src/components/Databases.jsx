import React, { useState, useEffect } from 'react';
import { Button, Modal, ListGroup, Container } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Queries from './Queries'
import api from '../api';

const Databases = ({ isLoggedIn }) => {
  const [databases, setDatabases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [databaseFile, setDatabaseFile] = useState(null);

  const fetchData = async () => {
    try {
      const response = await api.get('/databases', {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      if (response.statusText === "OK") {
        const data = await response.data;
        setDatabases(data);
      } else {
        console.error('Error fetching databases (Status Error):', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching databases:', error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const handleImportDatabase = async () => {
    if (databaseFile) {
      try {
        const formData = new FormData();
        formData.append('databaseFile', databaseFile);

        const response = await api.post('/databases', formData, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        if (response.statusText="Created") {
          toast.success('Database imported successfully!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
          });
          await fetchData();
          setShowModal(false);
          setDatabaseFile(null);
        } else {
          console.error('Error importing database:', response.statusText);
          toast.error('Database import failed. Please try again.', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
          });
        }
      } catch (error) {
        console.error('Error importing database:', error.message);
        toast.error('Database import failed. Please try again.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      }
    }
  };

  const handleRemoveDatabase = async (database) =>{
    try {
      const response = await api.delete(`/databases/${database._id}`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      console.log("!!!!")
      console.log(response);

      if (response.statusText="Created") {
        toast.success('Database removed successfully!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        await fetchData();
      } else {
        console.error('Error removing database:', response.statusText);
        toast.error('Database import failed. Please try again.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      }
    } catch (error) {
      console.error('Error removing database:', error.message);
      toast.error('Database removal failed. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDatabaseFile(file);
    }
  };

  return (
    <div className='dashboard'>
        <Container className='listDB'>
      <h2>Your Databases</h2>
        <hr/>
      {databases.length > 0 ? (
        <ListGroup>
        {databases.map((database) => (
          <>
          <div key={database._id} className='listgroup-holder'>
          <Link to={`/queries/${database._id}`}>
            <ListGroup.Item action>{database.filename}</ListGroup.Item>
          </Link>
          <p>
          ({new Date(database.createdAt).toLocaleString('en-GB',{
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
          })})
          </p>
          <Button variant="danger" onClick={() => handleRemoveDatabase(database)}>
            Remove
          </Button>
          </div>
          <hr/>
          </>
        ))}
      </ListGroup>
      ) : (
        <p>You haven't added any databases.</p>
      )}
        <hr/>
      <Button className='importBtn mb-3' onClick={() => setShowModal(true)}>
        Import Database
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Import Database</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" accept=".db" onChange={handleFileChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="dark" className='importBtn' onClick={handleImportDatabase}>
            Import Database
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
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

export default Databases;