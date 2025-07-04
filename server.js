import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan'; // HTTP request logger middleware
import cors from 'cors';
import compression from 'compression';

// Error handling
import { ApiError } from './utils/apiError.js';
import { globalError } from './middlewares/errorMiddleware.js';

// Database Connection
import dbConnection from './config/database.js';

// Routes
import mountRoutes from './routes/index.js';
import { webhookCheckout } from './services/orderService.js';

dotenv.config({ path: 'config.env' }); // Setting the .env variables
// Connect with db
dbConnection();

// To handle paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Express app
const app = express();

// Enable other domains to access my application
app.use(cors());

// Compress all responses
app.use(compression());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
mountRoutes(app);

// Generate error handling middleware for express
app.use((req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Express error handler => if you pass 4 params in app.use() => express error handler
// Global error handling middleware
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () =>
  console.log(`App listening on port ${PORT}!`)
);

// Events => listen => callback(err)
// Handling rejections outside express
process.on('unhandledRejection', (err) => {
  console.error('== Unhandled Rejection Detected ==');
  console.error('Name:', err.name);
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  server.close(() => {
    console.error(`Shutting down...`);
    process.exit(1);
  });
});
