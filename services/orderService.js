import { Order } from '../models/orderModel.js';
import { Cart } from '../models/cartModel.js';
import { Product } from '../models/productModel.js';
import { getAll, getOne } from './handlersFactory.js';
import { ApiError } from '../utils/apiError.js';

export const filterOrderForLoggedUser = async (req, res, next) => {
  if (req.user.role === 'user') req.filterObj = { user: req.user._id };
  next();
};

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/User-Admin-Manager
export const findAllOrders = getAll(Order);

// @desc    Get specific order
// @route   GET /api/v1/orders/:id
// @access  Private/User-Admin-Manager
export const findSpecificOrder = getOne(Order);

// @desc    Update order paid status to paid
// @route   POST /api/v1/orders/:id/pay
// @access  Private/Admin-Manager
export const updateOrderToPay = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no order with this id : ${req.params.id}`, 404)
    );
  }

  // Update order to paid
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ Success: true, data: updatedOrder });
};

// @desc    Update order delivered status
// @route   POST /api/v1/orders/:id/deliver
// @access  Private/Admin-Manager
export const updateOrderToDelivered = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no order with this id : ${req.params.id}`, 404)
    );
  }

  // Update order to paid
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ Success: true, data: updatedOrder });
};
