import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { ApiError } from '../utils/apiError.js';
import { User } from '../models/userModel.js';

const generateToken = payload =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

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
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new ApiError(
        'You are not login, Please login to get access to this route!',
        401,
      ),
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if user exist
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        'The user that belong to this token dose no longer exist!',
        401,
      ),
    );
  }

  // 4) Check if user his password after token created
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );
    // Password changed after token created (Error)
    if (passwordChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          'User recently changed his password, Please login again!',
          401,
        ),
      );
    }
  }

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
