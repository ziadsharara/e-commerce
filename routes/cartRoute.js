import express from 'express';
import {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateCartItemQuantity,
  applyCoupon,
} from '../services/cartService.js';
import * as authService from '../services/authService.js';

const router = express.Router();

router.use(authService.protect, authService.allowedTo('user'));

router
  .route('/')
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);
router.route('/applyCoupon').put(applyCoupon);
router
  .route('/:itemId')
  .put(updateCartItemQuantity)
  .delete(removeSpecificCartItem);

export default router;
