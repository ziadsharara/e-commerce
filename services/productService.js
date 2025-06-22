import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { Product } from '../models/productModel.js';
import { uploadMixOfImages } from '../middlewares/uploadImageMiddleware.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlersFactory.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const uploadProductImages = uploadMixOfImages([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 5,
  },
]);

export const resizeProductImages = async (req, res, next) => {
  // 1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    const imagePath = path.join(
      __dirname,
      `../uploads/products/${imageCoverFileName}`,
    );

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(imagePath);

    // sava image into our database
    req.body.imageCover = imageCoverFileName;
  }

  // 2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        const imagePath = path.join(
          __dirname,
          `../uploads/products/${imageName}`,
        );

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 95 })
          .toFile(imagePath);

        // sava image into our database
        req.body.images.push(imageName);
      }),
    );

    next();
  }
};

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = getAll(Product, 'Products');

// @dec     Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct = getOne(Product);

// @desc    Create Product
// @route   POST /api/v1/products
// @access  Private/Admin-Manager
export const createProduct = createOne(Product);
// @dec     Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin-Manager
export const updateProduct = updateOne(Product);

// @dec     Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = deleteOne(Product);
