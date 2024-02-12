const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

module.exports = (db) => {
  router.post('/', async (req, res) => {
    try {
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }

      const existingUser = await db.collection('users').findOne({ username });

      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const newUser = { username };
      const result = await db.collection('users').insertOne(newUser);

      res.status(201).json({ id: result.insertedId, username });
    } catch (error) {
      console.error('Error in user registration:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const users = await db.collection('users').find().toArray();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
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

      res.json(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.put('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }

      const existingUser = await db.collection('users').findOne({ username });

      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: { username } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  return router;
};