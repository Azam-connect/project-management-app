const express = require('express');
const router = express.Router();
const { ProjectController } = require('../../../controllers');
const {
  validateAccessToken,
} = require('../../../middlewares/validateAccessToken');

router.get('/list', validateAccessToken, ProjectController.getAllProjects);
router.get(
  '/user-projects',
  validateAccessToken,
  ProjectController.getUserProjects
);
router.get(
  '/user-projects/:id',
  validateAccessToken,
  ProjectController.getUserProjects
);
router.post('/create', validateAccessToken, ProjectController.createProject);
router.get(
  '/detail/:id',
  validateAccessToken,
  ProjectController.getProjectById
);
router.put('/update/:id', validateAccessToken, ProjectController.updateProject);
router.delete(
  '/delete/:id',
  validateAccessToken,
  ProjectController.deleteProject
);

module.exports = router;
