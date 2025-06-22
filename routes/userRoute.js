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

import * as authService from '../services/authService.js';

const router = express.Router();

router.put(
  '/changePassword/:id',
  changeUserPasswordValidator,
  changeUserPassword,
);

router
  .route('/')
  .get(authService.protect, authService.allowedTo('admin'), getUsers)
  .post(
    authService.protect,
    authService.allowedTo('admin'),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser,
  )
  .delete(authService.protect, authService.allowedTo('admin'), deleteAllUsers);
router
  .route('/:id')
  .get(
    authService.protect,
    authService.allowedTo('admin'),
    getUserValidator,
    getUser,
  )
  .put(
    authService.protect,
    authService.allowedTo('admin'),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser,
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteUserValidator,
    deleteUser,
  );

export default router;
