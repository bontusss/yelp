import AppError from '../utils/appError';
import Listing from '../model/listing';
import catchAsync from '../utils/catchAsync';

const createListing = catchAsync(async (req, res) => {
  const newListing = await Listing.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { newListing },
  });
});

const getListings = catchAsync(async (req, res, next) => {
  const listings = await Listing.find();
  res.status(200).json({
    status: 'success',
    result: listings.length,
    data: { listings },
  });
});

const updateListing = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findOneAndUpdate({ _id: id }, req.body);
  if (!listing) {
    return next(new AppError('Invalid id', 404));
  };
  res.status(200).json({
    status: 'success',
    data: { listing },
  });
});

export { createListing, updateListing, getListings };
