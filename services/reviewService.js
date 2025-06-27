import { Review } from '../models/reviewModel.js';
import {
  createOne,
  deleteAll,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlersFactory.js';

// Nested route
// GET /api/v1/products/:productId/reviews
export const createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of reviews
// @route   GET /api/v1/reviews
// @access  Public
export const getReviews = getAll(Review);

// @dec     Get specific review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
export const getReview = getOne(Review);

// Nested route (Create)
export const setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// @desc    Create Review
// @route   POST /api/v1/reviews
// @access  Private/Protect/User
export const createReview = createOne(Review);

// @dec     Update specific review
// @route   PUT /api/v1/reviews/:id
// @access  Private/Protect/User
export const updateReview = updateOne(Review);

// @dec     Delete specific review
// @route   DELETE /api/v1/reviews/:id
// @access  Private/Protect/User-Admin-Manager
export const deleteReview = deleteOne(Review);

// @dec     Delete all reviews
// @route   DELETE /api/v1/reviews/
// @access  Private/Protect/User-Admin-Manager
export const deleteAllReviews = deleteAll(Review);
