import slugify from 'slugify';
import { Product } from '../models/productModel.js';
import { ApiError } from '../utils/apiError.js';

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const products = await Product.find({}).skip(skip).limit(limit);
  res.status(200).json({
    success: true,
    results: products.length,
    page,
    data: products,
  });
};

// @dec     Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(200).json({ success: true, data: product });
};

// @desc    Create Product
// @route   POST /api/v1/products
// @access  Private
export const createProduct = async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
};

// @dec     Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private
export const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  req.body.slug = slugify(req.body.title);

  const product = await Product.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true }, // to return the data after update in response
  );

  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res.status(200).json({ success: true, data: product });
};

// @dec     Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }
  res
    .status(200)
    .json({ success: true, message: 'Product deleted successfully!' });
};
