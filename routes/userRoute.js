import express from 'express';
import {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
  deleteUserValidator,
} from '../utils/validators/userValidator.js';

import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  changeUserPassword,
  deleteUser,
  deleteAllUsers,
  uploadUserImage,
  resizeImage,
} from '../services/userService.js';

const router = express.Router();

router.put(
  '/changePassword/:id',
  changeUserPasswordValidator,
  changeUserPassword,
);

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
