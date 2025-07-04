import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { ApiError } from '../utils/apiError.js';
import { User } from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Signup
// @route   POST /api/v1/auth/signup
// @access  Public
export const signup = async (req, res, next) => {
  // 1- Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // 2- Generate token
  const token = generateToken(user._id);

  res.status(201).json({ success: true, data: user, token });
};

// @desc    Login
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
  // 1- check if there is email and password in the body (validation layer)
  // 2- check if user exist & check if password correct
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError('Incorrect email or password!', 401));
  }
  // 3- generate token
  const token = generateToken(user._id);

  // 4- send response to client side
  res.status(200).json({ success: true, data: user, token });
};

// @desc    Make sure the user is logged in
export const protect = async (req, res, next) => {
  // 1) Check if token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return next(
      new ApiError(
        'You are not login, Please login to get access to this route!',
        401,
      ),
    );
  }

  // 2) Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        'The user that belong to this token does no longer exist',
        401,
      ),
    );
  }

  // 4) Attach user to request
  req.user = currentUser;
  next();
};

// @desc    Authorization (User Permissions)
// ['admin', 'manager']
export const allowedTo =
  (...roles) =>
  async (req, res, next) => {
    // 1) Access roles
    // 2) Access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError('You are not allowed to access this route', 403),
      );
    }
    next();
  };
