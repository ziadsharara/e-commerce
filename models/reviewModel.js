import mongoose from 'mongoose';
import { Product } from './productModel.js';

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, 'Min ratings value is 1.0'],
      max: [5, 'Max ratings value is 5.0'],
      required: [true, 'Review ratings required'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to user'],
    },
    // Parent reference (one to many)
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to product'],
    },
  },
  { timestamps: true },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name' });
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId,
) {
  const results = await this.aggregate([
    // Stage 1 : get all reviews in specific product
    {
      $match: { product: productId },
    },
    // Stage 2 : Grouping reviews based on productID and calculate averageRatings, ratingsQuantity
    {
      $group: {
        _id: '$product',
        averageRatings: { $avg: '$ratings' },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  if (results.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: results[0].averageRatings,
      ratingsQuantity: results[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

// Use calcAverageRatingsAndQuantity() after create or update a review
reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

// Use calcAverageRatingsAndQuantity() after remove a review
reviewSchema.post('findOneAndDelete', async function (document) {
  if (document) {
    await document.constructor.calcAverageRatingsAndQuantity(document.product);
  }
});

export const Review = mongoose.model('Review', reviewSchema);
