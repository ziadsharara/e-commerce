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

const setImageURL = doc => {
  // Return image base url + image name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

// findOne, findAll, update
categorySchema.post('init', doc => {
  setImageURL(doc);
});

// create
categorySchema.post('save', doc => {
  setImageURL(doc);
});

// 2- Create Model
export const Category = mongoose.model('Category', categorySchema);
