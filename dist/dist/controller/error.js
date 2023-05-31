"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var AppError = require('../utils/appError');
var handleCastErrorDB = function (err) {
    var message = "Invalid ".concat(err.path, ": ").concat(err.value, ".");
    // @ts-ignore
    return new AppError(message, 400);
};
var handleDuplicateFieldsErrorDB = function (err) {
    var value = JSON.stringify(err.keyValue);
    var message = "Duplicate field value: ".concat(value, ", Please use another value.");
    // @ts-ignore
    return new AppError(message, 400);
};
var handleValidationErrorDB = function (err) {
    var errors = Object.values(err.errors).map(function (el) { return el.message; });
    var message = "Invalid input data. ".concat(errors.join('. '));
    // @ts-ignore
    return new AppError(message, 400);
};
var handleJWTError = function () {
    var message = 'Token is invalid or expired, Please login again!';
    // @ts-ignore
    return new AppError(message, 401);
};
var sendErrorDev = function (err, res) {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    });
};
var sendErrorProd = function (err, res) {
    // operational, trusted error
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        // programming or other unknown error, dont leak details
    }
    else {
        // log the error
        console.error('Error 💥', err);
        // send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong',
        });
    }
};
var globalErrorHandler = function (err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV == 'development') {
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV == 'production') {
        var error = __assign({}, err);
        if (err.name === 'CastError')
            error = handleCastErrorDB(error);
        if (err.code === 11000)
            error = handleDuplicateFieldsErrorDB(error);
        if (err.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')
            error = handleJWTError();
        sendErrorProd(error, res);
    }
};
exports.default = globalErrorHandler;
