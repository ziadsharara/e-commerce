import { check } from 'express-validator';
import { validatorMiddleware } from '../../middlewares/validatorMiddleware.js';

export const createAddressValidator = [
  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage(
      'Invalid phone number, only accepted Egy and SA phone numbers!',
    ),

  check('postalCode')
    .optional()
    .isPostalCode('any')
    .withMessage('Invalid postal code!'),

  validatorMiddleware,
];
