import express from 'express';
import { createPaymobPayment } from '../services/paymentService.js';
import * as authService from '../services/authService.js';

const router = express.Router();

router.post(
  '/create-payment',
  authService.protect,
  authService.allowedTo('user'),
  createPaymobPayment
);

export default router;
