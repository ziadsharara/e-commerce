import slugify from 'slugify';
import { Product } from '../models/productModel.js';
import { Category } from '../models/categoryModel.js';
import { ApiError } from '../utils/apiError.js';
import qs from 'qs'; // Use qs to properly parse nested query parameters

// @desc    Get list of products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = async (req, res) => {
  // 1) Filtering
  const rawQuery = req._parsedUrl.query;
  const queryObj = qs.parse(rawQuery);
  const excludeFields = ['page', 'sort', 'limit', 'fields'];
  excludeFields.forEach(field => delete queryObj[field]);

  // Apply filtration using [gte, gt, lte, lt]
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  const filter = JSON.parse(queryStr);

  // 2) Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  // Build query
  let mongooseQuery = Product.find(filter)
    .skip(skip)
    .limit(limit)
    .populate({ path: 'category', select: 'name -_id' });

  // 3) Sorting
  if (req.query.sort) {
    // Remove spaces and empty values from sort string
    const sortBy = req.query.sort
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .join(' ');
    if (sortBy) {
      mongooseQuery = mongooseQuery.sort(sortBy);
      console.log(sortBy);
    }
  } else {
    mongooseQuery = mongooseQuery.sort('-createAt');
  }

  // 4) Fields Limiting
  if (req.query.fields) {
    // title,ratingsAverage,ratingsAverage,price
    const fields = req.query.fields.split(',').join(' ');
    // title ratingsAverage ratingsAverage price
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select('-__v');
  }

  // Execute query
  const products = await mongooseQuery;

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
