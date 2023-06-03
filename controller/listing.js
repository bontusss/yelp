import Listing from '../model/listing';
import factory from './handleFactory';

// Get all tours from DB
const getTours = factory.getAll(Listing);

// Create a tour
const createTour = factory.createOne(Listing);

// Update a tour by id
const updateTour = factory.updateOne(Listing);

// Get a tour by ID
const getTour = factory.getOne(Listing, { path: 'reviews' });

// Delete a tour
const deleteTour = factory.deleteOne(Listing);

export default { deleteTour, getTour, updateTour, createTour, getTours };
