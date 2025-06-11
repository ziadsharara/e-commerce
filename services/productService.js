import slugify from 'slugify';
import qs from 'qs';
import { Product } from '../models/productModel.js';
import { Category } from '../models/categoryModel.js';
import { ApiError } from '../utils/apiError.js';
import ApiFeatures from '../utils/apiFeatures.js';

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = async (req, res) => {
  const rawQuery = req._parsedUrl.query;
  const parsedQuery = qs.parse(rawQuery);

  const apiFeatures = new ApiFeatures(Product.find(), parsedQuery)
    .paginate()
    .filter()
    .search()
    .limitFields()
    .sort();

  const products = await apiFeatures.mongooseQuery;

  res.status(200).json({
    success: true,
    results: products.length,
    data: products,
  });
};

// @dec     Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: 'category',
    select: 'name -_id',
  });
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
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

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
