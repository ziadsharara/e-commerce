import { Product } from '../models/productModel.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlersFactory.js';

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
// @access  Private
export const createProduct = createOne(Product);
// @dec     Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private
export const updateProduct = updateOne(Product);

// @dec     Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct = deleteOne(Product);
