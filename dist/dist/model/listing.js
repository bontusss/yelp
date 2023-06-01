"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var listingSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'A listing must have a title.'],
    },
    category: {
        type: String,
        enum: ['Sports club', 'Beauty & makeup', 'Night party', 'Spa', 'Restaurant', 'Hotel', 'Coffee and Bar', 'Shopping mall'],
        required: [true, 'A listing must have a category.'],
    },
    tags: {
        type: [String],
        // chicken wings, sports bars, seafoods, yoruba dishes
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'A listing must have a description.'],
    },
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
        },
        coordinates: [Number],
        state: { type: String, required: [true, 'A listing must specify the state it is located'] },
        city: { type: String, required: [true, 'A listing must specify the city it is located'] },
        address: { type: String, required: [true, 'A listing must specify the address it is located'] },
        zipcode: { type: String },
    },
    services: [
        {
            type: {
                type: String,
            },
            name: {
                type: String,
                required: [true, 'A service must have a name.'],
                trim: true,
            },
            price: Number,
            image: String,
        },
    ],
    facebook: String,
    instagram: String,
    twitter: String,
    linkedIn: String,
    createdAt: { type: Date, default: Date.now(), select: false },
});
var Listing = mongoose_1.default.model('Listing', listingSchema);
exports.default = Listing;
