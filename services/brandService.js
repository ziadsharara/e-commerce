import { Brand } from '../models/brandModel.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlersFactory.js';

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
// @access  Private
export const createBrand = createOne(Brand);

// @dec     Update specific brand
// @route   PUT /api/v1/brands/:id
// @access  Private
export const updateBrand = updateOne(Brand);

// @dec     Delete specific brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
export const deleteBrand = deleteOne(Brand);
