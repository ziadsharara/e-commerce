import { check } from 'express-validator';
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
    .withMessage('Too long Subcategory name'),
  check('category')
    .notEmpty()
    .withMessage('subCategory must belong to category')
    .isMongoId()
    .withMessage('Invalid Category id formate'),
  validatorMiddleware,
];

export const updateSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid Subcategory id formate'),
  validatorMiddleware,
];

export const deleteSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid Subcategory id formate'),
  validatorMiddleware,
];
