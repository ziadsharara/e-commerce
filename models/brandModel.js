import mongoose from 'mongoose';

// 1- Create Schemas
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Brand Required'],
      unique: [true, 'Brand must be unique'],
      minlength: [3, 'Too short brand name'],
      maxlength: [32, 'Too long brand name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true },
);

const setImageURL = doc => {
  // Return image base url + image name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

// findOne, findAll, update
brandSchema.post('init', doc => {
  setImageURL(doc);
});

// create
brandSchema.post('save', doc => {
  setImageURL(doc);
});

// 2- Create Model
export const Brand = mongoose.model('Brand', brandSchema);
