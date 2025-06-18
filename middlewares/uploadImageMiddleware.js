import multer from 'multer';
import { ApiError } from '../utils/apiError.js';

const multerOptions = () => {
  const storage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new ApiError('ONLY IMAGES ALLOWED!', 400), false);
    }
  };

  const upload = multer({ storage, fileFilter: multerFilter });
  return upload;
};

// To upload single image
export const uploadSingleImage = fieldName => multerOptions().single(fieldName);

// To upload mix of images
export const uploadMixOfImages = arrayOfFields =>
  multerOptions().fields(arrayOfFields);
