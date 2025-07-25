import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import sharp from 'sharp';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
  deleteAll,
} from './handlersFactory.js';
import { uploadSingleImage } from '../middlewares/uploadImageMiddleware.js';
import { ApiError } from '../utils/apiError.js';
import generateToken from '../utils/generateToken.js';

// To handle paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Upload single image
export const uploadUserImage = uploadSingleImage('profileImg');

// Image processing
export const resizeImage = async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  const imagePath = path.join(__dirname, `../uploads/users/${filename}`);

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(imagePath);

    // sava image into our database
    req.body.profileImg = filename;
  }
  next();
};

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Private/Admin
export const getUsers = getAll(User);

// @dec     Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private/Admin
export const getUser = getOne(User);

// @desc    Create User
// @route   POST /api/v1/users
// @access  Private/Admin
export const createUser = createOne(User);

// @dec     Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  // findOneAndUpdate(filter, update, options)
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    { new: true }, // to return the data after update in response
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: document });
};

// @dec     Change user password
// @route   PUT /api/v1/users/changePassword/:id
// @access  Private/Admin
export const changeUserPassword = async (req, res, next) => {
  // findOneAndUpdate(filter, update, options)
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }, // to return the data after update in response
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: document });
};

// @dec     Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = deleteOne(User);

// @dec     Delete all users
// @route   DELETE /api/v1/users
// @access  Private/Admin
export const deleteAllUsers = deleteAll(User);

// @desc    Get logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
export const getLoggedUserData = async (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

// @desc    Update logged user password
// @route   PUT /api/v1/users/changeMyPassword
// @access  Private/Protect
export const changeLoggedUserPassword = async (req, res, next) => {
  // Update user password based on user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true },
  );

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({ Success: true, data: user, token });
};

// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
export const updateLoggedUserData = async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true },
  );

  res.status(200).json({ Success: true, data: updatedUser });
};

// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
export const deleteLoggedUser = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res
    .status(200)
    .json({ Success: true, Message: 'User Deactivated Successfully!' });
};
