import { check } from 'express-validator';
import { User } from '../../models/userModel.js';
import { validatorMiddleware } from '../../middlewares/validatorMiddleware.js';

export const createAddressValidator = [
  check('alias')
    .notEmpty()
    .withMessage('Alias is required')
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user._id);
      if (!user) {
        throw new Error('User not found');
      }

      const isDuplicate = user.addresses.some(
        address => address.alias.toLowerCase() === val.toLowerCase(),
      );

      if (isDuplicate) {
        throw new Error('Address alias already exists!');
      }

      return true;
    }),

  check('phone')
    .notEmpty()
    .withMessage('Phone is required')
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage(
      'Invalid phone number, only accepted Egy and SA phone numbers!',
    ),

  check('postalCode')
    .notEmpty()
    .withMessage('Postal Code is required')
    .isPostalCode('any')
    .withMessage('Invalid postal code!'),

  validatorMiddleware,
];
