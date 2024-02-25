import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

import api from '../api';

const Queries = () => {
  const { databaseId } = useParams();
  const [queries, setQueries] = useState([]);
  const [newQuery, setNewQuery] = useState('');
  const [response, setResponse] = useState('');
  
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await api.get(`/queries/${databaseId}`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        console.log(response)
        if (response.statusText === 'OK') {
          const data = await response.data;
          setQueries(data);
        } else {
          console.error('Error fetching queries (Status Error):', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching queries:', error.message);
      }
    };

    fetchQueries();
  }, [databaseId]);

  const handleAddQuery = async () => { //u okviru nodejs srv treba da se pozove flask!
    try {
      const response = await api.post('/queries', { databaseId: databaseId, query: newQuery });
      if (response.statusText === 'Created') {
        await fetchQueries();
        setNewQuery('');
      } else {
        console.error('Error adding query:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding query:', error.message);
    }
  };

  return (
    <div className='dashboard' style={{ color: '#f2f2f2', display: 'flex', flexDirection: 'column'}}>
      <div className='chat-section' style={{ flex: '1', overflowY: 'auto', margin:'20px', width:'80%'}}>
        {queries.map((query) => (
          <div key={query._id} className='message'>
            <div className='user-message'>
              <p className='userText'>You</p>
              <p>{query.query}</p>
            </div>
            <div className='response-message'>
              <p className='modelText'>NLQ</p>
              <p>{query.response}</p>
              <br/>
            </div>
          </div>
        ))}
      </div>

      <div className='input-section' data-bs-theme="dark" style={{ display: 'flex',
       flexDirection: 'column',
        width: '80%'}}>
      <Form style={{ display: 'flex',
        flexDirection: 'row',
          position: 'relative',
          border:'2px solid #2f2f2f',
          borderRadius:'8px',
          backgroundColor:'#212529'}}>
      <Form.Control
        as='textarea'
        placeholder='Enter your query here'
        value={newQuery}
        onChange={(e) => setNewQuery(e.target.value)}
        style={{ resize: 'none',
         flex: '1',
          width: '100%',
          backgroundColor:'transparent',
          border:'none'}}
      />
      <Button
        variant='dark'
        className='importBtn sendBtn'
        onClick={handleAddQuery}
        style={{}}>
        <FontAwesomeIcon icon={faPaperPlane} />
      </Button>
    </Form>
    </div>
    <hr/>
    </div>
  );
  };

export default Queries;