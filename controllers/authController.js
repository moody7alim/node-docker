const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const newUser = await User.create(req.body);

    req.session.user = newUser;

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};



exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) throw new Error('User not found');

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) throw new Error('Incorrect password');
    req.session.user = user;
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  }
  catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
