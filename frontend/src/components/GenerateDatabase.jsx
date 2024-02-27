import React, { useState } from 'react';
import { Form, Button, Container, ListGroup, Modal, Badge } from 'react-bootstrap';
import api from '../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GenerateDatabase = () => {
  const [dbName, setDbName] = useState('');
  const [jobName, setJobName] = useState('');
  const [table, setTable] = useState('');
  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleAddTable = () => {
    if (table.trim() !== '') {
      setTables([...tables, table.trim()]);
      setTable('');
    }
  };

  const handleRemoveTable = (index) => {
    const updatedTables = [...tables];
    updatedTables.splice(index, 1);
    setTables(updatedTables);
  };

  const handleGenerateDatabase = () => {
    if (dbName.trim() === '' || jobName.trim() === '' || tables.length === 0) {
      toast.error('Please fill in all fields and add at least one table.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
      return;
    }

    //ovde salji na node sa body dbName jobName i tabele sa '\n'!

    console.log('Generating Database:', { dbName, jobName, tables }); //za test

    toast.success('Database successfully generated!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme:'dark',
      });

    setDbName('');
    setJobName('');
    setTables([]);
    setShowModal(false);
  };

  return (
    <div className='dashboard' style={{minHeight:'94.4vh'}}>
      <Container style={{textAlign:'center'}}>
        <h2>Generate a New Database</h2>
        <hr />

        <Form style={{textAlign:'center', width:'60%',margin:'auto'}}>
          <Form.Group className='mb-3' controlId='dbName'>
            <Form.Label>Database Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter database name (eg. new_db)'
              value={dbName}
              onChange={(e) => setDbName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='jobName'>
            <Form.Label>Job Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter the job (the purpose of db) name (eg. Employee Management)'
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='tables'>
          <Form.Label>Tables</Form.Label>
            <div className='d-flex'>
              <Form.Control
                type='text'
                placeholder='Add a table (eg. Employee)'
                value={table}
                onChange={(e) => setTable(e.target.value)}
              />
              <Button variant='dark' onClick={handleAddTable} className='sendBtn'>
                Add Table
              </Button>
            </div>
            <ListGroup className='mt-2' style={{height:'auto', alignContent:'center'}}>
              {tables.map((tableName, index) => (
                <>
                <br/>
                <ListGroup.Item key={index} className='d-flex justify-content-between align-items-center'>
                  {tableName}
                  <Button variant='dark' className='diagBtn' onClick={() => handleRemoveTable(index)}>
                    Remove
                  </Button>
                </ListGroup.Item>
                </>
              ))}
            </ListGroup>
          </Form.Group>

          <Button variant='dark' className='importBtn' onClick={() => setShowModal(true)}>
            Generate Database
          </Button>
        </Form>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Generation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to generate the database with the provided details?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='light' onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant='dark' className='importBtn' onClick={handleGenerateDatabase}>
            Generate
          </Button>
        </Modal.Footer>
      </Modal>
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
        theme='dark'
      />
    </div>
  );
};

export default GenerateDatabase;