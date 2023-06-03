import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, 'Review cannot be empty'] },
    rating: {
      type: Number,
      min: [1, 'Min is 1.0'],
      max: [5, 'Max rating is 5.0'],
    },
    createdAt: { type: Date, default: Date.now },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({ path: 'tour', select: 'name' }).populate({ path: 'user' });
  this.populate({ path: 'user' });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
