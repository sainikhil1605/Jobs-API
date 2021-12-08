const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthorizedError } = require('../errors');
const register = async (req, res) => {
  const user = await User.create({ ...req.body });

  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.getName() }, token: user.generateJWT() });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Email and password are required');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }
  if (!(await user.comparePassword(password))) {
    throw new UnauthorizedError('Invalid password');
  }
  const token = user.generateJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.getName() }, token });
};

module.exports = {
  register,
  login,
};
