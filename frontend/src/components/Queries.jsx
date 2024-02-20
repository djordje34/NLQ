import React from 'react';
import { useParams } from 'react-router-dom';

const Queries = () => {
  const { id } = useParams();
  if (!id) {
    return <div>Error: Nothing found not found</div>;
  }
  //fetch info using id

  return (
    <div className='dashboard' style={{color:'#f2f2f2'}}>
      <h2>Database Details</h2>
      <p>Database ID: {id}</p>
    </div>
  );
};

export default Queries;