const express = require('express');
const app = express();
const { connectToDatabase } = require('./db/mongo');
const userRoutes = require('./routes/users');
const databaseRoutes = require('./routes/databases');
const queryRoutes = require('./routes/queries');

const port = process.env.PORT || 3000;

app.use(express.json());

(async () => {
  try {
    const db = await connectToDatabase();

    app.use('/users', userRoutes(db));
    app.use('/databases', databaseRoutes(db));
    app.use('/queries', queryRoutes(db));

    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.listen(port, () => {
      console.log(`Server is listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
})();