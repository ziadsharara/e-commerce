import { check, body } from 'express-validator';
import { validatorMiddleware } from '../../middlewares/validatorMiddleware.js';

export const addWishlistValidator = [
  check('productId').isMongoId().withMessage('Invalid wishlist id formate'),
  validatorMiddleware,
];

export const removeWishlistValidator = [
  check('id').isMongoId().withMessage('Invalid wishlist id formate'),
  validatorMiddleware,
];
