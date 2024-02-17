import React, { useState, useEffect } from 'react';
import { Button, Modal, ListGroup, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../api';

const Databases = ({ isLoggedIn }) => {
  const [databases, setDatabases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [databaseFile, setDatabaseFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/databases', {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        console.log(response.statusText);
        if (response.statusText === "OK") {
        console.log(response);
          const data = await response.data;
          console.log(data);
          setDatabases(data);
        } else {
          console.error('Error fetching databases (Status Error):', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching databases:', error.message);
      }
    };

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

        if (response.ok) {

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
          const updatedDatabases = await api.get('/databases', {
            headers: {
              Authorization: `${localStorage.getItem('token')}`,
            },
          });
          setDatabases(updatedDatabases);

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
          <ListGroup.Item key={database._id} action onClick={{}}>{database.filename}</ListGroup.Item>
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
    </div>
  );
};

export default Databases;