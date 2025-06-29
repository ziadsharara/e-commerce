import express from 'express';
import {
  createCashOrder,
  filterOrderForLoggedUser,
  findAllOrders,
  findSpecificOrder,
  updateOrderToDelivered,
  updateOrderToPay,
  checkoutSession,
} from '../services/orderService.js';

import * as authService from '../services/authService.js';

const router = express.Router();

router.use(authService.protect);

router
  .route('/checkout-session/:cartId')
  .get(authService.allowedTo('user'), checkoutSession);

router.route('/:cartId').post(createCashOrder);
router
  .route('/')
  .get(
    authService.allowedTo('user', 'admin', 'manager'),
    filterOrderForLoggedUser,
    findAllOrders,
  );
router.route('/:id').get(findSpecificOrder);
router.put(
  '/:id/pay',
  authService.allowedTo('admin', 'manager'),
  updateOrderToPay,
);
router.put(
  '/:id/deliver',
  authService.allowedTo('admin', 'manager'),
  updateOrderToDelivered,
);

export default router;
