const express = require('express');
const router = express.Router();
const { TaskController } = require('../../../controllers');
const {
  validateAccessToken,
} = require('../../../middlewares/validateAccessToken');


module.exports = router;