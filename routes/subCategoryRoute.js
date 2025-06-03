import express from 'express';

import { createSubCategory } from '../services/subCategoryService.js';
import { createSubCategoryValidator } from '../utils/validators/subCategoryValidator.js';

const router = express.Router();

router.route('/').post(createSubCategoryValidator, createSubCategory);

export default router;
