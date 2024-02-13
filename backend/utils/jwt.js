const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;

const generateToken = (userId) => {
  return jwt.sign({ userId }, secretKey, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
