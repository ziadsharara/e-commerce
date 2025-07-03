import mongoose from 'mongoose';
import { Order } from '../models/orderModel.js';
import { Payment } from '../models/paymentModel.js';
import { AppError } from '../utils/apiError.js';
import {
  createCheckoutSession,
  getSessionStatus,
} from '../utils/stripeGateway.js';
import { getAll } from './handlersFactory.js';

// @desc Create payment intent for Stripe
// @route POST /api/v1/payment/create-intent/:orderId
// @access Private/protect/user
export const createPayment = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return next(new AppError('Invalid order ID', 400));
    }
    const order = await Order.findById(orderId);
    if (!order) return next(new AppError('Order not Found', 404));
    if (order.user.toString() !== req.user._id.toString())
      return next(new AppError('Not Authorized to access this order', 403));
    if (order.status !== 'pending') {
      return next(
        new AppError('Payment already processed for this order', 400),
      );
    }
    const paymentSession = await createCheckoutSession(
      order.totalOrderPrice || order.totalPrice, // Use totalOrderPrice if available
      order.currency || 'usd',
      { order: orderId.toString(), user: req.user._id.toString() },
      req,
    );
    if (!paymentSession.success)
      return next(
        new AppError(`Payment processing failed: ${paymentSession.error}`, 400),
      );
    const payment = await Payment.create({
      user: req.user._id,
      order: orderId,
      currency: order.currency || 'usd',
      paymentMethod: 'stripe',
      transactionId: paymentSession.sessionId,
      status: 'pending',
    });
    res.status(200).json({
      status: 'success',
      data: {
        checkoutUrl: paymentSession.checkoutUrl,
        paymentId: payment._id,
        sessionId: paymentSession.sessionId,
        orderId: order._id,
        paymentStatus: 'pending',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Confirm payment after Stripe processing
// @route POST /api/v1/payment/confirm/:paymentId
// @access Private/protect/user
export const confirmPayment = async (req, res, next) => {
  const { paymentSessionId } = req.body;
  if (!paymentSessionId)
    return next(new AppError('Payment intent ID not found', 400));
  const { paymentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(paymentId)) {
    return next(new AppError('Invalid payment ID', 400));
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) return next(new AppError('Payment not found', 404));
    if (payment.user.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to access this payment', 403));
    }
    if (payment.transactionId !== paymentSessionId) {
      return next(new AppError('Payment intent ID mismatch', 400));
    }
    if (payment.status === 'completed') {
      return next(new AppError('Payment already processed', 400));
    }
    const paymentResult = await getSessionStatus(paymentSessionId);
    if (!paymentResult.success) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError('Payment not successful', 400));
    }
    // Update payment and order status
    payment.status = 'completed';
    await payment.save({ session });
    const order = await Order.findById(payment.order).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError('Order not found', 404));
    }
    order.status = 'processing';
    await order.save({ session });
    // Optionally, create a shipping record if needed
    // const { address } = req.body;
    // await Shipping.create({
    //   user: req.user._id,
    //   order: order._id,
    //   status: 'pending',
    //   address: address || order.shippingAddress,
    // });
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      status: 'success',
      message: 'Payment confirmed and order processing',
      data: {
        paymentId: payment._id,
        orderId: order._id,
        paymentStatus: payment.status,
        orderStatus: order.status,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc get payment details
// @route GET /api/v1/payment/:paymentId
// @access Private/protect/user
export const getPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return next(new AppError('Invalid payment ID', 400));
    }
    const payment = await Payment.findById(paymentId).populate('order');
    if (!payment) return next(new AppError('Payment not found', 404));
    if (payment.user.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to access this payment', 403));
    }
    res.status(200).json({
      status: 'success',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc get all payments details
// @route GET /api/v1/payment
// @access Private/protect/admin
export const getAllPayments = getAll(Payment);
