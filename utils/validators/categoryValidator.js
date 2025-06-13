import { check, body } from 'express-validator';
import slugify from 'slugify';
import { validatorMiddleware } from '../../middlewares/validatorMiddleware.js';

export const getCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id formate'),
  validatorMiddleware,
];

export const createCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Category Required')
    .isLength({ min: 3 })
    .withMessage('Too short category name')
    .isLength({ max: 32 })
    .withMessage('Too long category name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  ,
  validatorMiddleware,
];

export const updateCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id formate'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

export const deleteCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid category id formate'),
  validatorMiddleware,
];
