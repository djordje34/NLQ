const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

module.exports = (db) => {
  router.post('/', async (req, res) => {
    try {
      const { userId, path, filename } = req.body;

      if (!userId || !path || !filename) {
        return res.status(400).json({ error: 'userId, path, and filename are required' });
      }

      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const newDatabase = { userId: user._id, path, filename };
      const result = await db.collection('databases').insertOne(newDatabase);

      res.status(201).json({ id: result.insertedId, userId: user._id, path, filename });
    } catch (error) {
      console.error('Error in database creation:', error);
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

      const databases = await db.collection('databases').find({ userId: user._id }).toArray();
      res.json(databases);
    } catch (error) {
      console.error('Error fetching databases:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  return router;
};