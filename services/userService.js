import { User } from '../models/userModel.js';
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
// @access  Private
export const getUsers = getAll(User);

// @dec     Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Private
export const getUser = getOne(User);

// @desc    Create User
// @route   POST /api/v1/users
// @access  Private
export const createUser = createOne(User);

// @dec     Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private
export const updateUser = updateOne(User);

// @dec     Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private
export const deleteUser = deleteOne(User);

// @dec     Delete all users
// @route   DELETE /api/v1/users
// @access  Private
export const deleteAllUsers = deleteAll(User);
