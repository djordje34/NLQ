const { verifyToken } = require('../../utils/jwt');

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const userId = await verifyToken(token);
    if (!userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.userId = userId;
    
    next();
  } catch (error) {
    console.error('Error decoding token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = { authenticateUser };
