import express from 'express';
import {
  createPaymobPayment,
  paymobWebhook,
} from '../services/paymentService.js';
import * as authService from '../services/authService.js';

const router = express.Router();

router.post(
  '/create-payment',
  authService.protect,
  authService.allowedTo('user'),
  createPaymobPayment
);

router.post('/paymob-webhook', express.json({ type: '*/*' }), paymobWebhook);

export default router;
