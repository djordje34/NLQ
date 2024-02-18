const express = require('express');
const { ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs/promises');
const multer = require('multer');
const { authenticateUser } = require('./middleware/auth');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (db) => {
  router.post('/', authenticateUser, upload.single('databaseFile'), async (req, res) => {
    try {
      const { originalname, buffer } = req.file;
      const userId = req.userId;
      console.log(userId, originalname);
      if (!userId || !originalname) {
        return res.status(400).json({ error: 'userId and originalname are required' });
      }
  
      const userDatabaseDir = path.join(__dirname, '..', 'data', userId); //popravi za root data path.join(__dirname, '..', '..', 'data', userId);
      const newPath = path.join(userDatabaseDir, originalname);
  
      try {
        await fs.mkdir(userDatabaseDir, { recursive: true });
        await fs.writeFile(newPath, buffer);
      } catch (error) {
        console.error('Error writing database file:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      const newDatabase = {
        userId: new ObjectId(userId),
        path: newPath,
        filename: originalname,
        createdAt: new Date()
      };

      const result = await db.collection('databases').insertOne(newDatabase);

      res.status(201).json({ id: result.insertedId, userId, originalname, originalname });
    } catch (error) {
      console.error('Error in database upload:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/', authenticateUser, async (req, res) => {
    try {
      const authenticatedUserId = req.userId;
      console.log(authenticatedUserId);
      const user = await db.collection('users').findOne({ _id: new ObjectId(authenticatedUserId) });

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