import express from 'express';
import { createListing, updateListing, getListings } from '../controller/listing';

const listingRouter = express.Router();

listingRouter.route('/').post(createListing).get(getListings);

listingRouter.route('/:id').patch(updateListing);

export default listingRouter;
