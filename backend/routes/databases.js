const express = require('express');
const { ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs/promises');
const multer = require('multer');
const axios = require('axios');
const { authenticateUser } = require('./middleware/auth');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (db) => {
  router.post('/', authenticateUser, upload.single('databaseFile'), async (req, res) => {
    try {
      const { originalname, buffer } = req.file;
      const userId = req.userId;
      if (!userId || !originalname) {
        return res.status(400).json({ error: 'userId and originalname are required' });
      }


      const existingDatabase = await db.collection('databases').findOne({
        userId: new ObjectId(userId),
        filename: originalname
      });
      if (existingDatabase) {
        return res.status(403).json({ error: 'Database with the same name already exists' });
        
      }
  
      const userDatabaseDir = path.join(__dirname, '..', '..', 'data', userId);
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

      res.status(201).json({ id: result.insertedId,
         userId,
          originalname});
    } catch (error) {
      console.error('Error in database upload:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/', authenticateUser, async (req, res) => {
    try {
      const authenticatedUserId = req.userId;
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

  router.delete('/:databaseId', authenticateUser, async (req, res) => {
    try {
      const { databaseId: requestDBId } = req.params;
      const authenticatedUserId = req.userId;
      
      const user = await db.collection('users').findOne({ _id: new ObjectId(authenticatedUserId) });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const database = await db.collection('databases').findOne({ _id: new ObjectId(requestDBId), userId: user._id });
  
      if (!database) {
        return res.status(404).json({ error: 'Database not found' });
      }
      
      try {
        await fs.unlink(database.path);
    } catch (error) {
        console.error('Error deleting database file:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

      await db.collection('databases').deleteOne({ _id: new ObjectId(requestDBId) });
  
      res.json({ message: 'Database deleted successfully' });
    } catch (error) {
      console.error('Error deleting database:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/diagrams/:databaseId', authenticateUser, async (req, res) => {
    try {
      const authenticatedUserId = req.userId;
      const { databaseId } = req.params;
      const user = await db.collection('users').findOne({ _id: new ObjectId(authenticatedUserId) });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const database = await db.collection('databases').findOne({ _id: new ObjectId(databaseId), userId: user._id });

      if(!database) {
        return res.status(404).json({ error: 'Database not found' });
      }

      const response = await axios.get(`http://127.0.0.1:5000/api/diagrams`, {
        params: {
          filename: database.filename,
          userId: authenticatedUserId,
        },
      });

      const diagramPath = response.data.path;

      const fileName = path.basename(diagramPath);
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      res.setHeader('Content-Type', 'image/png');
      res.download(diagramPath, fileName);
    } catch (error) {
      console.error('Error downloading diagram:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/generate', authenticateUser, async (req, res) => {
    try {

      const {job, tables, name} = req.body;
      const userId = req.userId;

      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      if (!job || !tables || !name) {
        return res.status(400).json({ error: 'parameters are required' });
      }


      const response = await axios.post(`http://127.0.0.1:5000/api/database`, {
          job: job,
          tables: tables,
          userId: userId,
          name:name
      });

      const path = response.data.path;

      const newDatabase = {
        userId: new ObjectId(userId),
        path: path,
        filename: name+".db",
        createdAt: new Date()
      };

      const result = await db.collection('databases').insertOne(newDatabase);

      res.status(201).json({ id: result.insertedId,
         userId,
          name,
        path});

    } catch (error) {
      console.error('Error in database generation:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  return router;
};