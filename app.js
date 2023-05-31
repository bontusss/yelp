import express from 'express';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import AppError from './utils/appError';
import globalErrorHandler from './controller/error';
import { createListing } from './controller/listing';
import listingRouter from './route/listing'

dotenv.config({ path: './config.env' });

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/listings', listingRouter);

app.all('*', (req, res, next) => {
  return next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

// Error handler
app.use(globalErrorHandler);

export default app;
