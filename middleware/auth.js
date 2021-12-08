const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors');

const auth = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided');
  }
  const token = authorization.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
};
module.exports = auth;
