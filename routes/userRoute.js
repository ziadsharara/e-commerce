import express from 'express';
import {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
} from '../utils/validators/userValidator.js';

import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
  uploadUserImage,
  resizeImage,
} from '../services/userService.js';

const router = express.Router();

router
  .route('/')
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser)
  .delete(deleteAllUsers);
router
  .route('/:id')
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

export default router;
