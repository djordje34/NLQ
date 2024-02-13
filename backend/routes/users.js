const express = require('express');
const { ObjectId } = require('mongodb');
const crypto = require('crypto');

const router = express.Router();

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// add auth to the methods!

module.exports = (db) => {

  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;

      const existingUser = await db.collection('users').findOne({ username });

      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      const hashedPassword = hashPassword(password);

      if (existingUser.password !== hashedPassword) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      const token = generateToken(existingUser._id);

      res.json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

    router.post('/', authenticateUser, async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const existingUser = await db.collection('users').findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const hashedPassword = hashPassword(password);
      const newUser = { username, password: hashedPassword };
      const result = await db.collection('users').insertOne(newUser);
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error in user registration:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/', authenticateUser, async (req, res) => {
    try {
      const users = await db.collection('users').find().toArray();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/:userId', authenticateUser, async (req, res) => {
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

  router.put('/:userId', authenticateUser, async (req, res) => {
    try {
      const { userId } = req.params;
      const { username, password } = req.body;

      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }

      const existingUser = await db.collection('users').findOne({ username });

      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const hashedPassword = hashPassword(password);

      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: { username, password: hashedPassword } }
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