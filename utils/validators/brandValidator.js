import { check } from 'express-validator';
import { validatorMiddleware } from '../../middlewares/validatorMiddleware.js';

export const getBrandValidator = [
  check('id').isMongoId().withMessage('Invalid brand id formate'),
  validatorMiddleware,
];

export const createBrandValidator = [
  check('name')
    .notEmpty()
    .withMessage('Brand Required')
    .isLength({ min: 3 })
    .withMessage('Too short brand name')
    .isLength({ max: 32 })
    .withMessage('Too long brand name'),
  validatorMiddleware,
];

export const updateBrandValidator = [
  check('id').isMongoId().withMessage('Invalid brand id formate'),
  validatorMiddleware,
];

export const deleteBrandValidator = [
  check('id').isMongoId().withMessage('Invalid brand id formate'),
  validatorMiddleware,
];
