import { check, body } from 'express-validator';
import { validatorMiddleware } from '../../middlewares/validatorMiddleware.js';
import slugify from 'slugify';
import { Review } from '../../models/reviewModel.js';

export const createReviewValidator = [
  check('title').optional(),
  check('ratings')
    .notEmpty()
    .withMessage('Ratings value required')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Ratings value must be between 1 to 5'),
  check('user').isMongoId().withMessage('Invalid review id formate'),
  check('product')
    .isMongoId()
    .withMessage('Invalid review id formate')
    .custom((val, { req }) =>
      // Check if logged user create review before
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        review => {
          if (review) {
            return Promise.reject(
              new Error('You already created a review before'),
            );
          }
        },
      ),
    ),

  validatorMiddleware,
];

export const getReviewValidator = [
  check('id').isMongoId().withMessage('Invalid review id formate'),
  validatorMiddleware,
];

export const updateReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid review id formate')
    .custom((val, { req }) =>
      // Check review ownership before update
      Review.findById(val).then(review => {
        if (!review) {
          return Promise.reject(
            new Error(`There is no review with this id ${val}`),
          );
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`You are not allowed to perform this action`),
          );
        }
      }),
    ),
  validatorMiddleware,
];

export const deleteReviewValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid review id formate')
    .custom((val, { req }) => {
      // Check review ownership before update
      if (req.user.role === 'user') {
        return Review.findById(val).then(review => {
          if (!review) {
            return Promise.reject(
              new Error(`There is no review with id ${val}`),
            );
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error(`Your are not allowed to perform this action`),
            );
          }
        });
      }
      return true;
    }),
  ,
  validatorMiddleware,
];
