import slugify from 'slugify';
import SubCategory from '../models/subCategoryModel.js';
import { ApiError } from '../utils/apiError.js';

// @desc    Create subCategory
// @route   POST /api/v1/subcategories
// @access  Private
export const createSubCategory = async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
};
