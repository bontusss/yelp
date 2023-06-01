import AppError from '../utils/appError';
import Listing from '../model/listing';
import catchAsync from '../utils/catchAsync';
import APIFEATURES from '../utils/apiFeatures';

const createListing = catchAsync(async (req, res) => {
  const newListing = await Listing.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { newListing },
  });
});

const getListings = catchAsync(async (req, res, next) => {
  const features = new APIFEATURES(Listing.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const listings = await features.query;

  res.status(200).json({
    status: 'success',
    result: listings.length,
    data: { listings },
  });
});

const updateListing = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  if (!listing) {
    return next(new AppError('Invalid id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { listing },
  });
});

const deleteListing = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const tour = await Listing.findByIdAndDelete(id);
  if (!tour) {
    return next(new AppError('invalid ID', 404));
  }
  res.status(204).json({
    status: 'success',
    message: 'Tour was deleted successfully',
  });
});

export { createListing, updateListing, getListings, deleteListing };
