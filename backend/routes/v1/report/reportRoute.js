const express = require('express');
const router = express.Router();
const { ReportController } = require('../../../controllers');
const {
  validateAccessToken,
} = require('../../../middlewares/validateAccessToken');

router.get(
  '/project-report',
  validateAccessToken,
  ReportController.getProjectReportSummary
);
router.get(
  '/project-tasks-count/:userId',
  validateAccessToken,
  ReportController.getTaskCountByUser
);
router.get(
  '/upcomming-tasks/:userId',
  validateAccessToken,
  ReportController.getUpcomingTasks
);
router.get(
  '/user-project-summary/:userId',
  validateAccessToken,
  ReportController.getUserProjectReportSummary
);
router.get(
  '/user-daily-activity/:userId',
  validateAccessToken,
  ReportController.getUserDailyActivity
);
router.post(
  '/user-comparison-report',
  validateAccessToken,
  ReportController.getUserComparison
);
router.get('/export-task-report', validateAccessToken, ReportController.exportTasksReport);

module.exports = router;
