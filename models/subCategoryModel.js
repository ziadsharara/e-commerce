import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, // remove unwanted spaces => 'hp ' => 'hp'
      unique: [true, 'SubCategory must be unique!'],
      minlength: [2, 'Too short SubCategory name'],
      maxlength: [32, 'Tpp long SubCategory name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'SubCategory must be belong to parent category'],
    },
  },
  { timestamps: true },
);

const subCategory = mongoose.model('SubCategory', subCategorySchema);
export default subCategory;
