import express from 'express';
import * as authService from '../services/authService.js';
import * as paymentService from '../services/paymentService.js';

const router = express.Router();

router.use(authService.protect, authService.allowedTo('user'));

router.route('/create-intent/:orderId').post(paymentService.createPayment);

router.route('/confirm/:paymentId').post(paymentService.confirmPayment);

router.route('/:paymentId').get(paymentService.getPayment);

router
  .route('/')
  .get(
    authService.allowedTo('admin', 'manager'),
    paymentService.getAllPayments,
  );

export default router;
