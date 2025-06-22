import { Brand } from '../models/brandModel.js';
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
export const uploadBrandImage = uploadSingleImage('image');

// Image processing
export const resizeImage = async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  const imagePath = path.join(__dirname, `../uploads/brands/${filename}`);

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(imagePath);
  }
  // sava image into our database
  req.body.image = filename;

  next();
};

// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
export const getBrands = getAll(Brand);

// @dec     Get specific brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
export const getBrand = getOne(Brand);

// @desc    Create Brand
// @route   POST /api/v1/brands
// @access  Private/Admin-Manager
export const createBrand = createOne(Brand);

// @dec     Update specific brand
// @route   PUT /api/v1/brands/:id
// @access  Private/Admin-Manager
export const updateBrand = updateOne(Brand);

// @dec     Delete specific brand
// @route   DELETE /api/v1/brands/:id
// @access  Private/Admin
export const deleteBrand = deleteOne(Brand);
