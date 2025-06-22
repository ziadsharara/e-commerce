import crypto from 'crypto';

import { User } from '../models/userModel.js';
import { ApiError } from '../utils/apiError.js';

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
const forgotPassword = async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with this email => ${req.body.email}`),
      404,
    );
  }

  // 2) If user exist, Generate hashed reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // 3) Send the reset code via email
};

export default forgotPassword;
