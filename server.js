import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan'; // HTTP request logger middleware

dotenv.config({ path: 'config.env' }); // Setting the .env variables
import dbConnection from './config/database.js';
import categoryRoute from './routes/categoryRoute.js';

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

app.use((req, res, next) => {
  // Create error and send it to error handling middleware
  const err = new Error(`Can't find this route: ${req.originalUrl}`);
  next(err.message);
});

// Express error handler => if you pass 4 params in app.use() => express error handler
// Global error handling middleware
app.use((error, req, res, next) => {
  res.status(500).json({ success: false, error });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
