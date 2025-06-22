import express from 'express';
import {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  updateLoggedUserValidator,
  changeUserPasswordValidator,
  deleteUserValidator,
} from '../utils/validators/userValidator.js';

import {
  getUsers,
  getUser,
  getLoggedUserData,
  createUser,
  updateUser,
  updateLoggedUserData,
  changeUserPassword,
  changeLoggedUserPassword,
  deleteUser,
  deleteLoggedUser,
  deleteAllUsers,
  uploadUserImage,
  resizeImage,
} from '../services/userService.js';

import * as authService from '../services/authService.js';

const router = express.Router();

router.use(authService.protect);

router.get('/getMe', getLoggedUserData, getUser);
router.put('/changeMyPassword', changeLoggedUserPassword);
router.put('/updateMe', updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe', deleteLoggedUser);

// Admin
router.use(authService.allowedTo('admin'));

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
