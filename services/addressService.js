import { User } from '../models/userModel.js';

// @desc    Add address to user addresses list
// @route   POST /api/v1/addresses
// @access  Protected/User
export const addAddress = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      // $addToSet => add address object to user address array if address not exist
      $addToSet: { addresses: req.body },
    },
    { new: true },
  );

  res.status(200).json({
    Success: true,
    message: 'Address added successfully!',
    data: user.addresses,
  });
};

// @desc    Remove address from user addresses list
// @route   DELETE /api/v1/addresses/:addressId
// @access  Protected/User
export const removeAddress = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      // $pull => remove address object from user address array if address exist
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true },
  );

  res.status(200).json({
    Success: true,
    message: 'Address removed successfully!',
    data: user.addresses,
  });
};

// @desc    Get logged user addresses
// @route   GET /api/v1/addresses
// @access  Protected/User
export const getLoggedUserAddresses = async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('addresses');

  res.status(200).json({
    Success: true,
    Products: user.addresses.length,
    data: user.addresses,
  });
};
