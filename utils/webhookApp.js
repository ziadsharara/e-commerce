import express from 'express';
import { webhookCheckout } from '../services/orderService.js';

const webhookApp = express();

webhookApp.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout,
);

export default webhookApp;
