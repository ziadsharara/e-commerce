import express from 'express';
import {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} from '../services/wishlistService.js';

import {
  addWishlistValidator,
  removeWishlistValidator,
} from '../utils/validators/wishlistValidator.js';

import * as authService from '../services/authService.js';

const router = express.Router();

router.use(authService.protect, authService.allowedTo('user'));

router
  .route('/')
  .get(getLoggedUserWishlist)
  .post(addWishlistValidator, addProductToWishlist);

router.delete(
  '/:productId',
  removeWishlistValidator,
  removeProductFromWishlist,
);

export default router;
