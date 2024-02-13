const { verifyToken } = require('./jwt');

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = verifyToken(token);

  if (!userId) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.userId = userId;
  next();
};

module.exports = { authenticateUser };
