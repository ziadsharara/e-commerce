import { check, body } from 'express-validator';
import slugify from 'slugify';
import { validatorMiddleware } from '../../middlewares/validatorMiddleware.js';

export const getSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid Subcategory id formate'),
  validatorMiddleware,
];

export const createSubCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('SubCategory Required')
    .isLength({ min: 2 })
    .withMessage('Too short Subcategory name')
    .isLength({ max: 32 })
    .withMessage('Too long Subcategory name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  ,
  check('category')
    .notEmpty()
    .withMessage('subCategory must belong to category')
    .isMongoId()
    .withMessage('Invalid Category id formate'),
  validatorMiddleware,
];

export const updateSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid Subcategory id formate'),
  body('name').custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

export const deleteSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid Subcategory id formate'),
  validatorMiddleware,
];
