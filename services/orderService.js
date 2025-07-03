import { Order } from '../models/orderModel.js';
import { Cart } from '../models/cartModel.js';
import { Product } from '../models/productModel.js';
import { User } from '../models/userModel.js';
import { getAll, getOne } from './handlersFactory.js';
import { ApiError } from '../utils/apiError.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config({ path: 'config.env' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create cash order
// @route   POST /api/v1/orders/cartId
// @access  Private/User
export const createCashOrder = async (req, res, next) => {
  // App settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no cart with this id ${req.params.cartId}`, 404),
    );
  }

  // 2) Get order price depend on cart price "Check if coupon applied !"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create order with default payment method type => Cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  // 4) After creating order => (decrement product quantity, increment product sold)
  // bulk options => help you to send multiple operation in one query
  if (order) {
    const bulkOption = cart.cartItems.map(item => ({
      updateOne: {
        filter: {
          _id: item.product,
        },
        update: {
          $inc: {
            quantity: -item.quantity,
            sold: +item.quantity,
          },
        },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(201).json({ Success: true, data: order });
};

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
      new ApiError(`There is no order with this id : ${req.params.id}`, 404),
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
      new ApiError(`There is no order with this id : ${req.params.id}`, 404),
    );
  }

  // Update order to paid
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ Success: true, data: updatedOrder });
};

// @desc    Get checkout session from stripe and send it as response
// @route   GET /api/v1/orders/checkout-session/:cartId
// @access  Private/User
export const checkoutSession = async (req, res, next) => {
  console.log('KEY:', process.env.STRIPE_SECRET_KEY);
  // App settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no cart with this id ${req.params.cartId}`, 404),
    );
  }

  // 2) Get order price depend on cart price "Check if coupon applied !"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  const token = req.headers.authorization?.split(' ')[1];

  const successUrl = `https://e-commerce-production-ef93.up.railway.app/orders?Authorization=${token}`;
  const cancelUrl = `https://e-commerce-production-ef93.up.railway.app/cart?Authorization=${token}`;

  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: {
      ...(req.body?.shippingAddress || {}),
    },
  });

  // 4) Send session to response
  res.status(200).json({ Success: true, session });
};

const createCartOrder = async session => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const orderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  // Create order with default paymentMethodType card
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: 'card',
  });

  // After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map(item => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // Clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
  }
};
// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
export const webhookCheckout = async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log('✅ Stripe Event:', event.type);

    if (event.type === 'checkout.session.completed') {
      await createCartOrder(event.data.object);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('❌ Webhook verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
