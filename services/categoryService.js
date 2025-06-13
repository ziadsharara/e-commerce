import { Category } from '../models/categoryModel.js';
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
} from './handlersFactory.js';
import { uploadSingleImage } from '../middlewares/uploadImageMiddleware.js';

// To handle paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Upload single image
export const uploadCategoryImage = uploadSingleImage('image');

// Image processing
export const resizeImage = async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  const imagePath = path.join(__dirname, `../uploads/categories/${filename}`);

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(imagePath);

  // sava image into our database
  req.body.image = filename;

  next();
};

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = getAll(Category);

// @dec     Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
export const getCategory = getOne(Category);

// @desc    Create Category
// @route   POST /api/v1/categories
// @access  Private
export const createCategory = createOne(Category);

// @dec     Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
export const updateCategory = updateOne(Category);
// @dec     Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
export const deleteCategory = deleteOne(Category);
