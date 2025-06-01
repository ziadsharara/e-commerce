import { validationResult } from 'express-validator';

// @desc  Finds the validation errors in this request and wrap them in an object with handy function
export const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};
