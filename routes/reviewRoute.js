import express from 'express';
import {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} from '../utils/validators/reviewValidator.js';
import {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  deleteAllReviews,
  createFilterObj,
  setProductIdAndUserIdToBody,
} from '../services/reviewService.js';

import * as authService from '../services/authService.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(createFilterObj, getReviews)
  .post(
    authService.protect,
    authService.allowedTo('user'),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview,
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteAllReviews,
  );
router
  .route('/:id')
  .get(getReviewValidator, getReview)
  .put(
    authService.protect,
    authService.allowedTo('user'),
    updateReviewValidator,
    updateReview,
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin', 'manager', 'user'),
    deleteReviewValidator,
    deleteReview,
  );

export default router;
