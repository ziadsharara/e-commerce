import { Coupon } from '../../models/couponModel.js';
import { check, body } from 'express-validator';
import { validatorMiddleware } from '../../middlewares/validatorMiddleware.js';

export const getCouponValidator = [
  check('id').isMongoId().withMessage('Invalid coupon id formate'),
  validatorMiddleware,
];

export const createCouponValidator = [
  check('name')
    .notEmpty()
    .withMessage('Coupon Required')
    .toUpperCase()
    .custom(val =>
      Coupon.findOne({ name: val }).then(coupon => {
        if (coupon) {
          return Promise.reject(new Error('Coupon already exist!'));
        }
      }),
    ),

  validatorMiddleware,
];

export const updateCouponValidator = [
  check('id').isMongoId().withMessage('Invalid coupon id format'),

  check('name').custom(val =>
    Coupon.findOne({ name: val }).then(coupon => {
      if (coupon) {
        return Promise.reject(new Error('Coupon already exist!'));
      }
    }),
  ),

  validatorMiddleware,
];

export const deleteCouponValidator = [
  check('id').isMongoId().withMessage('Invalid coupon id formate'),
  validatorMiddleware,
];
