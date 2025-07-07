import express from 'express';
import bodyParser from 'body-parser';

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

router.post('/paymob-webhook', bodyParser.json({ type: '*/*' }), paymobWebhook);

export default router;
