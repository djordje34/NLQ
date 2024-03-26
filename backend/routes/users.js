const express = require('express');
const { ObjectId } = require('mongodb');
const crypto = require('crypto');
const { authenticateUser } = require('./middleware/auth');
const {generateToken} = require('../utils/jwt');
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

    router.post('/', async (req, res) => {
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

  router.get('/all', authenticateUser, async (req, res) => {
    try {
      const users = await db.collection('users').find().toArray();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  /* 
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
*/

  router.get('/', authenticateUser, async (req, res) => { //To work without params - NEW
    try {
      const userId = req.userId;

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

  router.put('/', authenticateUser, async (req, res) => {
    try {
      const userId = req.userId;
      const { username, password, email } = req.body;
      
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (email && email !== user.email) {
        const existingUserWithEmail = await db.collection('users').findOne({ email });
  
        if (existingUserWithEmail && existingUserWithEmail._id.toString() !== userId) {
          return res.status(400).json({ error: 'Email already in use' });
        }
      }
  
      if (username && username !== user.username) {
        const existingUser = await db.collection('users').findOne({ username });
  
        if (existingUser && existingUser._id.toString() !== userId) {
          return res.status(400).json({ error: 'Username already exists' });
        }
  
        await db.collection('users').updateOne(
          { _id: new ObjectId(userId) },
          { $set: { username } }
        );
      }
  
      if (password) {
        const hashedPassword = hashPassword(password);
  
        await db.collection('users').updateOne(
          { _id: new ObjectId(userId) },
          { $set: { password: hashedPassword } }
        );
      }
  
      if (email) {
        await db.collection('users').updateOne(
          { _id: new ObjectId(userId) },
          { $set: { email } }
        );
      }
  
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  return router;
};