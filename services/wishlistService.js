import { User } from '../models/userModel.js';

// @desc    Add product to wishlist
// @route   POST /api/v1/wishlist
// @access  Protected/User
export const addProductToWishlist = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      // $addToSet => add productId to wishlist array if productId not exist
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true },
  );

  res.status(200).json({
    Success: true,
    message: 'Product added successfully to your wishlist.',
    data: user.wishlist,
  });
};

// @desc    Remove product from wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Protected/User
export const removeProductFromWishlist = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      // $pull => remove productId from wishlist array if productId exist
      $pull: { wishlist: req.params.productId },
    },
    { new: true },
  );

  res.status(200).json({
    Success: true,
    message: 'Removed successfully from your wishlist.',
    data: user.wishlist,
  });
};

// @desc    Get logged user wishlist
// @route   GET /api/v1/wishlist
// @access  Protected/User
export const getLoggedUserWishlist = async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('wishlist');

  res.status(200).json({
    Success: true,
    Products: user.wishlist.length,
    data: user.wishlist,
  });
};
