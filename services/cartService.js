import { ApiError } from '../utils/apiError.js';
import { User } from '../models/userModel.js';
import { Coupon } from '../models/couponModel.js';
import { Cart } from '../models/cartModel.js';
import { Product } from '../models/productModel.js';

const calcTotalCartPrice = cart => {
  let totalPrice = 0;
  cart.cartItems.forEach(item => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

// @dec     Add Product to cart
// @route   POST /api/v1/cart
// @access  Private/User
export const addProductToCart = async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  // 1) Get Cart for logged user
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // Create cart for logged user with product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // Product exist in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      item => item.product.toString() === productId && item.color === color,
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      // Product not exist in cart, Push product to cartItems array
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }
  // Calculate total cart price
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    Success: true,
    message: 'Product added to cart successfully',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
};

// @dec     Get logged user cart
// @route   GET /api/v1/cart
// @access  Private/User
export const getLoggedUserCart = async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id : ${req.user._id}`, 404),
    );
  }

  res
    .status(200)
    .json({ Success: true, numOfCartItems: cart.cartItems.length, data: cart });
};

// @dec     Remove specific cart item
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/User
export const removeSpecificCartItem = async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true },
  );

  calcTotalCartPrice(cart);
  cart.save();

  res.status(200).json({
    Success: true,
    message: 'Product deleted from cart successfully',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
};

// @dec     Remove all logged cart items
// @route   DELETE /api/v1/cart
// @access  Private/User
export const clearCart = async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
};

// @dec     Update specific cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private/User
export const updateCartItemQuantity = async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError(`There ius no cart for `));
  }

  const itemIndex = cart.cartItems.findIndex(
    item => item._id.toString() === req.params.itemId,
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`There is no item for this id : ${req.params.itemId}`, 404),
    );
  }

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    Success: true,
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
};

// @dec     Apply coupon on logged user cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User
export const applyCoupon = async (req, res, next) => {
  // 1) Get coupon based based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`));
  }

  // 2) Get logged user cart to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2); // 99.23

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    Success: true,
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
};
