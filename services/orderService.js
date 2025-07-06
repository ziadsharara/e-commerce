import { Order } from '../models/orderModel.js';
import { getAll, getOne } from './handlersFactory.js';

export const filterOrderForLoggedUser = (req, res, next) => {
  if (req.user.role === 'user') {
    req.filterObj = { user: req.user._id };
  }
  next();
};

export const findAllOrders = getAll(Order);
export const getOrderById = getOne(Order);
