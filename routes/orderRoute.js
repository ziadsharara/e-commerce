import express from 'express';
import {
  filterOrderForLoggedUser,
  findAllOrders,
  getOrderById,
} from '../services/orderService.js';

import * as authService from '../services/authService.js';

const router = express.Router();

router.use(authService.protect);

router
  .route('/')
  .get(
    authService.allowedTo('user', 'admin', 'manager'),
    filterOrderForLoggedUser,
    findAllOrders
  );
router.route('/:id').get(getOrderById);

export default router;
