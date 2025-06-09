import slugify from 'slugify';
import Brand from '../models/brandModel.js';
import { ApiError } from '../utils/apiError.js';

// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
export const getBrands = async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const brands = await Brand.find({}).skip(skip).limit(limit);
  res.status(200).json({
    success: true,
    results: brands.length,
    page,
    data: brands,
  });
};

// @dec     Get specific brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
export const getBrand = async (req, res, next) => {
  // ============ Error Handling ============ //
  // 1- then() catch(err)
  // 2- try {} catch(err)
  // 3- asyncHandler(async func) ==> express error handler
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    // ApiError('message', statusCode)
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(200).json({ success: true, data: brand });
};

// @desc    Create Brand
// @route   POST /api/v1/brands
// @access  Private
export const createBrand = async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.create({ name, slug: slugify(name) });
  res.status(201).json({ success: true, data: brand });
};

// @dec     Update specific brand
// @route   PUT /api/v1/brands/:id
// @access  Private
export const updateBrand = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  // findOneAndUpdate(filter, update, options)
  const brand = await Brand.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }, // to return the data after update in response
  );

  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(200).json({ success: true, data: brand });
};

// @dec     Delete specific brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
export const deleteBrand = async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndDelete(id);

  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res
    .status(200)
    .json({ success: true, message: 'Brand deleted successfully!' });
};
