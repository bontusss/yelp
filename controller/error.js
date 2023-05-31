const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  // @ts-ignore
  return new AppError(message, 400);
};

const handleDuplicateFieldsErrorDB = (err) => {
  const value = JSON.stringify(err.keyValue);
  const message = `Duplicate field value: ${value}, Please use another value.`;
  // @ts-ignore
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  // @ts-ignore
  return new AppError(message, 400);
};

const handleJWTError = () => {
  const message = 'Token is invalid or expired, Please login again!';
  // @ts-ignore
  return new AppError(message, 401);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // operational, trusted error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // programming or other unknown error, dont leak details
  } else {
    // log the error
    console.error('Error 💥', err);

    // send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV == 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV == 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsErrorDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') error = handleJWTError();
    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
