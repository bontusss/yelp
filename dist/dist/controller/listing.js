var Listing = ;
var AppError = require('../utils/appError');
var catchAsync = require('../utils/catchAsync');
var factory = require('./handlerFactory');
// Get all tours from DB
exports.getTours = factory.getAll(Tour);
// Create a tour
exports.createTour = factory.createOne(Tour);
// Update a tour by id
exports.updateTour = factory.updateOne(Tour);
// Get a tour by ID
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
// Delete a tour
exports.deleteTour = factory.deleteOne(Tour);
