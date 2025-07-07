import axios from 'axios';
import { Order } from '../models/orderModel.js';
import { Cart } from '../models/cartModel.js';
import { Product } from '../models/productModel.js';
import { ApiError } from '../utils/apiError.js';
import dotenv from 'dotenv';

dotenv.config({ path: 'config.env' });

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
const PAYMOB_API_URL = process.env.PAYMOB_API_URL;
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID;

function checkPaymobEnv(next) {
  if (
    !PAYMOB_API_KEY ||
    !PAYMOB_INTEGRATION_ID ||
    !PAYMOB_API_URL ||
    !PAYMOB_IFRAME_ID
  ) {
    next(
      new ApiError('Paymob environment variables are not set correctly', 500)
    );
  }
}

async function getAuthToken() {
  const response = await axios.post(`${PAYMOB_API_URL}/auth/tokens`, {
    api_key: PAYMOB_API_KEY,
  });
  return response.data.token;
}

async function createPaymobOrder(authToken, amount) {
  const response = await axios.post(`${PAYMOB_API_URL}/ecommerce/orders`, {
    auth_token: authToken,
    delivery_needed: false,
    amount_cents: Math.round(amount * 100),
    currency: 'EGP',
    items: [],
  });
  return response.data.id;
}

async function createPaymentKey(authToken, orderId, amount, billingData) {
  const response = await axios.post(
    `${PAYMOB_API_URL}/acceptance/payment_keys`,
    {
      auth_token: authToken,
      amount_cents: Math.round(amount * 100),
      expiration: 3600,
      order_id: orderId,
      currency: 'EGP',
      integration_id: PAYMOB_INTEGRATION_ID,
      billing_data: billingData,
    }
  );
  return response.data.token;
}

export const createPaymobPayment = async (req, res, next) => {
  checkPaymobEnv(next);
  try {
    const { amount } = req.body;
    if (!amount) return next(new ApiError('Amount is required', 400));

    const userCart = await Cart.findOne({ user: req.user._id });
    if (!userCart) return next(new ApiError('Cart not found', 404));

    const authToken = await getAuthToken();
    const paymobOrderId = await createPaymobOrder(authToken, amount);

    const billingData = {
      apartment: '123',
      email: req.user.email,
      floor: '1',
      first_name: req.user.name ? req.user.name.split(' ')[0] : 'User',
      street: 'Example Street',
      building: '12',
      phone_number: req.user.phone || '+201111111111',
      shipping_method: 'PKG',
      postal_code: '12345',
      city: 'Cairo',
      country: 'EG',
      last_name: req.user.name
        ? req.user.name.split(' ').slice(1).join(' ') || 'Unknown'
        : 'Unknown',
      state: 'Cairo',
      user_id: req.user._id.toString(),
    };

    const order = await Order.create({
      user: req.user._id,
      cartItems: userCart.cartItems,
      totalOrderPrice: userCart.totalCartPrice,
      paymentMethod: 'paymob',
      paymobOrderId,
      isPaid: false,
    });

    await Cart.findOneAndDelete({ user: req.user._id });

    const paymentKey = await createPaymentKey(
      authToken,
      paymobOrderId,
      amount,
      billingData
    );

    const iframeUrl = `https://accept.paymobsolutions.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
    res.status(200).json({
      success: true,
      iframeUrl,
      paymobOrderId,
      orderId: order._id,
    });
  } catch (error) {
    console.error('Paymob error:', error.message);
    next(new ApiError('Error creating Paymob payment: ' + error.message, 500));
  }
};

export const paymobWebhook = async (req, res) => {
  const { obj } = req.body;

  if (req.headers['x-paymob-secret'] !== process.env.PAYMOB_WEBHOOK_SECRET) {
    return res.status(401).json({ message: 'Unauthorized webhook call' });
  }

  if (obj.success && obj.order && obj.order.id) {
    const order = await Order.findOne({ paymobOrderId: obj.order.id });
    if (!order)
      return res.status(400).json({ message: 'Order not found for payment' });

    order.isPaid = true;
    order.paidAt = Date.now();
    await order.save();

    for (const item of order.cartItems) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: { quantity: -item.quantity, sold: +item.quantity },
        },
        { new: true }
      );
    }

    return res.status(200).json({ received: true, orderId: order._id });
  }

  res.status(400).json({ message: 'Invalid webhook data' });
};
