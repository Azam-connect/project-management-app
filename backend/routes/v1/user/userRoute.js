const express = require('express');
const router = express.Router();
const { UserController } = require('../../../controllers');
const {
  validateAccessToken,
} = require('../../../middlewares/validateAccessToken');

router.post('/register', validateAccessToken, UserController.register);
router.post('/login', UserController.login);
router.post('/refresh-token', UserController.refreshToken);
router.get('/profile-list', validateAccessToken, UserController.getUserList);
router.get('/profile', validateAccessToken, UserController.getUserProfile);
router.get('/profile/:id', validateAccessToken, UserController.getUserProfile);
router.put('/profile', validateAccessToken, UserController.updateUser);
router.put('/profile/:id', validateAccessToken, UserController.updateUser);

module.exports = router;
