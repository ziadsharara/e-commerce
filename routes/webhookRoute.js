import express from 'express';
import { paymobWebhook } from '../services/paymentService.js';

const router = express.Router();

router.post('/paymob', express.json({ type: '*/*' }), paymobWebhook);

export default router;
