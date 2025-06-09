import express from 'express';

import {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} from '../services/subCategoryService.js';
import {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} from '../utils/validators/subCategoryValidator.js';

// mergeParams: allow us to access parameters on other routers
// ex: We need to access categoryId from category router
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory)
  .get(createFilterObj, getSubCategories);
router
  .route('/:id')
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

export default router;
