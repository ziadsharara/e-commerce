import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}
const stripe = new Stripe(stripeSecretKey);

export const createCheckoutSession = async (
  amount,
  currency = 'usd',
  metadata = {},
  req,
) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: metadata.productName || 'Order Payment',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${req.protocol}://${req.get('host')}/api/v1/payment/confirm/:paymentId`,
      cancel_url: `${req.protocol}://${req.get('host')}/api/v1/cart`,
      customer_email: req.user.email,
      metadata,
    });

    return {
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getSessionStatus = async sessionId => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return {
      success: true,
      status: session.payment_status,
      paymentMethod: session.payment_method_types[0],
      amount: session.amount_total,
      gateWayResponse: session,
    };
  } catch (error) {
    console.error('Error retrieving session status:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
