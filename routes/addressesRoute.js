import express from 'express';
import {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} from '../services/addressService.js';

import { createAddressValidator } from '../utils/validators/addressesValidator.js';

import * as authService from '../services/authService.js';

const router = express.Router();

router.use(authService.protect, authService.allowedTo('user'));

router
  .route('/')
  .get(getLoggedUserAddresses)
  .post(createAddressValidator, addAddress);

router.delete('/:addressId', removeAddress);

export default router;
