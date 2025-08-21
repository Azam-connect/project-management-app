const { ReportService } = require('../../../services');

class ReportController {
  async getProjectReportSummary(req, res, next) {
    try {
      const { projectId } = req.query;
      const report = await ReportService.getTaskCompletionReport(projectId);
      return res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  }

  async getUserProjectReportSummary(req, res, next) {
    try {
      const { userId } = req.params;
      const report = await ReportService.getUserProjectSummary(userId);
      return res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  }

  async getTaskCountByUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { projectId } = req.query; // Optional projectId
      const report = await ReportService.getTaskCountByUser(userId, projectId);
      return res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  }

  async getUpcomingTasks(req, res, next) {
    try {
      const { userId } = req.params;
      const { daysAhead } = req.query; // Optional projectId
      const report = await ReportService.getUpcomingTasks(userId, daysAhead);
      return res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  }

  async getUserDailyActivity(req, res, next) {
    try {
      const { userId } = req.params;
      const { startDate, endDate } = req.query; // Optional date range
      const report = await ReportService.getUserDailyActivity(
        userId,
        startDate,
        endDate
      );
      return res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  }

  async getUserComparison(req, res, next) {
    try {
      const { userIds, projectId } = req.body;
      const report = await ReportService.getUserComparison(userIds, projectId);
      return res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();
