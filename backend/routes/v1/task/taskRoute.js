const express = require('express');
const router = express.Router();
const { TaskController } = require('../../../controllers');
const {
  validateAccessToken,
} = require('../../../middlewares/validateAccessToken');

const { upload } = require('../../../utils/fileUploadUtil');

router.get(
  '/list',
  validateAccessToken,
  TaskController.getTasksByProject
);
router.get(
  '/list/:projectId',
  validateAccessToken,
  TaskController.getTasksByProject
);
router.get('/detail/:taskId', validateAccessToken, TaskController.getTaskById);
router.post(
  '/add',
  validateAccessToken,
  upload.array('attachments', 5), // Allow up to 5 attachments
  TaskController.createTask
);
router.put(
  '/modify/:taskId',
  validateAccessToken,
  upload.array('attachments', 5), // Allow up to 5 attachments
  TaskController.updateTask
);
router.delete('/purge/:taskId', validateAccessToken, TaskController.deleteTask);
router.post('/add-comment/:taskId', validateAccessToken, TaskController.addCommentToTask);

module.exports = router;
