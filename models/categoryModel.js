import mongoose from 'mongoose';

// 1- Create Schemas
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category Required'],
      unique: [true, 'Category must be unique'],
      minlength: [3, 'Too short category name'],
      maxlength: [32, 'Too long category name'],
    },
    // A and B => shopping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }, // (created at / updated at)
);

// 2- Create Model
export const Category = mongoose.model('Category', categorySchema);
