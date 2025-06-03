import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan'; // HTTP request logger middleware

import { ApiError } from './utils/apiError.js';
import { globalError } from './middlewares/errorMiddleware.js';
import dbConnection from './config/database.js';
import categoryRoute from './routes/categoryRoute.js';
import subCategoryRoute from './routes/subCategoryRoute.js';

dotenv.config({ path: 'config.env' }); // Setting the .env variables
// Connect with db
dbConnection();

// Express app
const app = express();

// Middlewares
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/subcategories', subCategoryRoute);

// Generate error handling middleware for express
app.use((req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Express error handler => if you pass 4 params in app.use() => express error handler
// Global error handling middleware
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`),
);

// Events => listen => callback(err)
// Handling rejections outside express
process.on('unhandledRejection', err => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  // finish all processes on the server and exit from app
  server.close(() => {
    console.error(`Shutting down...`);
    process.exit(1);
  });
});
