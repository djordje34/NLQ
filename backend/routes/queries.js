const express = require('express');
const { ObjectId } = require('mongodb');
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

      const newQuery = { 
        userId: user._id, 
        databaseId: database._id, 
        query, 
        response,
        createdAt: new Date() };
      const result = await db.collection('queries').insertOne(newQuery);

      res.status(201).json({ id: result.insertedId, userId: user._id, databaseId: database._id, query, response });
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

      const database = await db.collection('databases').findOne({ _id: new ObjectId(requestDBId), userId: user._id });
  
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

  //endpoint za samo 1 query delete!

  return router;
};