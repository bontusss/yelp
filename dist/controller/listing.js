"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var listing_1 = __importDefault(require("../model/listing"));
var handleFactory_1 = __importDefault(require("./handleFactory"));
// Get all tours from DB
var getTours = handleFactory_1.default.getAll(listing_1.default);
// Create a tour
var createTour = handleFactory_1.default.createOne(listing_1.default);
// Update a tour by id
var updateTour = handleFactory_1.default.updateOne(listing_1.default);
// Get a tour by ID
var getTour = handleFactory_1.default.getOne(listing_1.default, { path: 'reviews' });
// Delete a tour
var deleteTour = handleFactory_1.default.deleteOne(listing_1.default);
exports.default = { deleteTour: deleteTour, getTour: getTour, updateTour: updateTour, createTour: createTour, getTours: getTours };
