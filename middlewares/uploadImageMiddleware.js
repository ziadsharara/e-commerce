import multer from 'multer';
import { ApiError } from '../utils/apiError.js';

export const uploadSingleImage = fieldName => {
  const storage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new ApiError('ONLY IMAGES ALLOWED!', 400), false);
    }
  };

  const upload = multer({ storage, fileFilter: multerFilter });

  return upload.single(fieldName);
};
