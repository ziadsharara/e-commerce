import { check, body } from 'express-validator';
import { validatorMiddleware } from '../../middlewares/validatorMiddleware.js';
import slugify from 'slugify';
import { User } from '../../models/userModel.js';

export const createUserValidator = [
  check('name')
    .notEmpty()
    .withMessage('User Required')
    .isLength({ min: 3 })
    .withMessage('Too short user name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check('email')
    .notEmpty()
    .withMessage('Email required!')
    .isEmail()
    .withMessage('Invalid email address!')
    .custom(val =>
      User.findOne({ email: val }).then(user => {
        if (user) {
          return Promise.reject(new Error('Email already in user!'));
        }
      }),
    ),

  check('password')
    .notEmpty()
    .withMessage('Password required!')
    .isLength({ min: 6 })
    .withMessage('Password must be at 6 characters!')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect!');
      }
      return true;
    }),

  check('passwordConfirm').notEmpty().withMessage('Password confirm required!'),

  check('phone')
    .optional()
    .isMobilePhone('ar-EG', 'ar-SA')
    .withMessage(
      'Invalid phone number, only accepted Egy and SA phone number!',
    ),

  check('profileImg').optional(),

  check('role').optional(),

  validatorMiddleware,
];

export const getUserValidator = [
  check('id').isMongoId().withMessage('Invalid user id formate'),
  validatorMiddleware,
];

export const updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid user id formate'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

export const deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid user id formate'),
  validatorMiddleware,
];
