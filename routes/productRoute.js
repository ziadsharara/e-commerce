import express from 'express';
import {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} from '../utils/validators/productValidator.js';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} from '../services/productService.js';
import reviewsRoute from './reviewRoute.js';

import * as authService from '../services/authService.js';

const router = express.Router();

// POST   /products/6848a0ed67b165999b3e5d4b/reviews
// GET   /products/6848a0ed67b165999b3e5d4b/reviews
// GET   /products/6848a0ed67b165999b3e5d4b/reviews/685b5f783513465f4c881929
router.use('/:productId/reviews', reviewsRoute);

router
  .route('/')
  .get(getProducts)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct,
  );
router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct,
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteProductValidator,
    deleteProduct,
  );

export default router;
