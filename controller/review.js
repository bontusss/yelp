import Review from '../models/reviews';
import factory from './handlerFactory';

// exports.createReview = catchAsync(async (req, res, next) => {
//   // allow nested route
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;
//   const newReview = await Review.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: { review: newReview },
//   });
// });

exports.getReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
