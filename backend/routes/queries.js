const express = require('express');
const { ObjectId } = require('mongodb');
const axios = require('axios');
const { authenticateUser } = require('./middleware/auth');

const router = express.Router();

module.exports = (db) => {
  router.post('/', authenticateUser, async (req, res) => {
    try {
      const { databaseId, query } = req.body;
      const userId = req.userId;
      if (!userId || !databaseId || !query) {
        return res.status(400).json({ error: 'userId, databaseId and query are required' });
      }

      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const database = await db.collection('databases').findOne({ _id: new ObjectId(databaseId) });

      if (!database) {
        return res.status(404).json({ error: 'Database not found' });
      }
      const flaskEndpoint = 'http://127.0.0.1:5000/api/process';
      const requestData = {
        filename: database.filename,
        userId: userId,
        question: query
      };

      const flaskResponse = await axios.post(flaskEndpoint, requestData);
      response = flaskResponse.data.response;

      const newQuery = { 
        userId: user._id, 
        databaseId: database._id, 
        query, 
        response,
        createdAt: new Date() };
      const result = await db.collection('queries').insertOne(newQuery);

      res.status(201).json({ id: result.insertedId, 
        userId: user._id, 
        databaseId: database._id, 
        query, 
        response });
    } catch (error) {
      console.error('Error in query creation:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/:databaseId', authenticateUser, async (req, res) => { //proveri
    try {
      //const { userId } = req.params;
      const userId = req.userId;
      const { databaseId: databaseId } = req.params;
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const database = await db.collection('databases').findOne({ _id: new ObjectId(databaseId), userId: user._id });
  
      if (!database) {
        return res.status(404).json({ error: 'Database not found' });
      }
      
      const queries = await db.collection('queries').find({ userId: user._id, databaseId:database._id }).toArray();
      res.json(queries);
    } catch (error) {
      console.error('Error fetching queries:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.delete('/:queryId', authenticateUser, async (req, res) => {
    try {
        const { queryId } = req.params;
        const authenticatedUserId = req.userId;

        const user = await db.collection('users').findOne({ _id: new ObjectId(authenticatedUserId) });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const query = await db.collection('queries').findOne({ _id: new ObjectId(queryId), userId: user._id });
        if (!query) {
            return res.status(404).json({ error: 'Query not found' });
        }

        await db.collection('queries').deleteOne({ _id: new ObjectId(queryId) });

        res.status(200).json({ message: 'Query deleted successfully' });
    } catch (error) {
        console.error('Error deleting query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


  return router;
};