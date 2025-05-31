const express = require('express');
const { getCategory, createCategory } = require('../services/categoryService');

const router = express.Router();

router.route('/').get(getCategory).post(createCategory);

module.exports = router;
