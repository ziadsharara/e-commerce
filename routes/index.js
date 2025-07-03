import categoryRoute from './categoryRoute.js';
import subCategoryRoute from './subCategoryRoute.js';
import brandRoute from './brandRoute.js';
import productRoute from './productRoute.js';
import userRoute from './userRoute.js';
import authRoute from './authRoute.js';
import reviewRoute from './reviewRoute.js';
import wishlistRoute from './wishlistRoute.js';
import addressesRoute from './addressesRoute.js';
import couponRoute from './couponRoute.js';
import cartRoute from './cartRoute.js';
import orderRoute from './orderRoute.js';
import paymentRoute from './paymentRoute.js';

const mountRoutes = app => {
  app.use('/api/v1/categories', categoryRoute);
  app.use('/api/v1/subcategories', subCategoryRoute);
  app.use('/api/v1/brands', brandRoute);
  app.use('/api/v1/products', productRoute);
  app.use('/api/v1/users', userRoute);
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/reviews', reviewRoute);
  app.use('/api/v1/wishlist', wishlistRoute);
  app.use('/api/v1/addresses', addressesRoute);
  app.use('/api/v1/coupons', couponRoute);
  app.use('/api/v1/cart', cartRoute);
  app.use('/api/v1/orders', orderRoute);
  app.use('/api/v1/payment', paymentRoute);
};

export default mountRoutes;
