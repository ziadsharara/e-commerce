import express from 'express';
import {
  signupValidator,
  loginValidator,
} from '../utils/validators/authValidator.js';

import { signup, login } from '../services/authService.js';
import {
  forgotPassword,
  verifyPasswordResetCode,
  resetPassword,
} from '../services/forgotPasswordService.js';

const router = express.Router();

router.route('/signup').post(signupValidator, signup);
router.route('/login').post(loginValidator, login);
router.route('/forgotPassword').post(forgotPassword);
router.route('/verifyResetCode').post(verifyPasswordResetCode);
router.route('/resetPassword').put(resetPassword);

export default router;
