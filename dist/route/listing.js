"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var listing_1 = require("../controller/listing");
var listingRouter = express_1.default.Router();
listingRouter.route('/').post(listing_1.createListing).get(listing_1.getListings);
listingRouter.route('/:id').patch(listing_1.updateListing);
exports.default = listingRouter;
