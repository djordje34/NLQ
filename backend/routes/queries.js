const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

module.exports = (db) => {
  router.post('/', async (req, res) => {
    try {
      const { userId, databaseId, query, response } = req.body;

      if (!userId || !databaseId || !query || !response) {
        return res.status(400).json({ error: 'userId, databaseId, query, and response are required' });
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
        query, response,
        createdAt: new Date() };
      const result = await db.collection('queries').insertOne(newQuery);

      res.status(201).json({ id: result.insertedId, userId: user._id, databaseId: database._id, query, response });
    } catch (error) {
      console.error('Error in query creation:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const queries = await db.collection('queries').find({ userId: user._id }).toArray();
      res.json(queries);
    } catch (error) {
      console.error('Error fetching queries:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  return router;
};