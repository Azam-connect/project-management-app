const { Task, Project, User, ActivityLog } = require('../../../models');

class ReportService {
  // 1. Get task completion report by project
  async getTaskCompletionReport(projectId) {
    if (!projectId) throw new Error('Project ID is required');

    // Count total tasks and done tasks
    const [
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      testingTasks,
    ] = await Promise.all([
      Task.countDocuments({ projectId }),
      Task.countDocuments({
        projectId,
        status: 'done',
      }),
      Task.countDocuments({
        projectId,
        status: 'in-progress',
      }),
      Task.countDocuments({ projectId, status: 'todo' }),
      Task.countDocuments({
        projectId,
        status: 'testing',
      }),
    ]);

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      testingTasks,
      completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
    };
  }

  // 2. Task count by user (across projects or by project)
  async getTaskCountByUser(userId, projectId = null) {
    if (!userId) throw new Error('User ID is required');

    const matchQuery = { assignedTo: userId };
    if (projectId) {
      matchQuery.projectId = projectId;
    }

    const [totalTasks, completedTasks] = await Promise.all([
      Task.countDocuments(matchQuery),
      await Task.countDocuments({
        ...matchQuery,
        status: 'done',
      }),
    ]);

    return { totalTasks, completedTasks };
  }

  // 3. Get tasks due soon (within next N days)
  async getUpcomingTasks(userId, daysAhead = 7) {
    if (!userId) throw new Error('User ID is required');

    const now = new Date();
    const futureDate = new Date(
      now.getTime() + daysAhead * 24 * 60 * 60 * 1000
    );

    const tasks = await Task.find({
      assignedTo: userId,
      deadline: { $gte: now, $lte: futureDate },
      status: { $ne: 'done' },
    }).sort({ deadline: 1 });

    return tasks;
  }

  // 4. Project progress summary for a user (number of projects and tasks)
  async getUserProjectSummary(userId) {
    if (!userId) throw new Error('User ID is required');

    const projects = await Project.find({ teamMembers: userId });

    const projectSummaries = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = await Task.countDocuments({
          projectId: project._id,
        });
        const completedTasks = await Task.countDocuments({
          projectId: project._id,
          status: 'done',
        });
        return {
          projectId: project._id,
          projectTitle: project.title,
          totalTasks,
          completedTasks,
          completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
        };
      })
    );

    return {
      totalProjects: projects.length,
      projectSummaries,
    };
  }

  // 5. Daily user activity report (tasks created, updated, commented, etc.) for a date range
  async getUserDailyActivity(userId, startDate, endDate) {
    if (!userId) throw new Error('User ID is required');
    if (!startDate || !endDate)
      throw new Error('Start and end dates are required');

    const activities = await ActivityLog.find({
      user: userId,
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).sort({ createdAt: 1 });

    // Group by date (YYYY-MM-DD)
    const grouped = activities.reduce((acc, activity) => {
      const day = activity.createdAt.toISOString().split('T')[0];
      if (!acc[day]) acc[day] = [];
      acc[day].push(activity);
      return acc;
    }, {});

    return grouped;
  }

  // 6. User comparison report (task completions, activities count)
  async getUserComparison(userIds, projectId = null) {
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      throw new Error('User IDs array is required');
    }

    const comparison = await Promise.all(
      userIds.map(async (userId) => {
        const matchTask = { assignedTo: userId };
        if (projectId) matchTask.projectId = projectId;

        const [totalTasks, completedTasks, activityCount, user] = await Promise.all([Task.countDocuments(matchTask), Task.countDocuments({
          ...matchTask,
          status: 'done',
        }), ActivityLog.countDocuments({
          user: userId,
          ...(projectId && { projectId }),
        }), User.findById(userId).select('name email')]);

        return {
          userId,
          userName: user ? user.name : 'Unknown',
          totalTasks,
          completedTasks,
          activityCount,
        };
      })
    );

    return comparison;
  }

  // 7. Export tasks report as CSV (example: task list for a project)
  // This returns data ready for CSV conversion; actual CSV export handled separately
  async exportTasksReport(projectId) {
    if (!projectId) throw new Error('Project ID is required');

    const tasks = await Task.find({ projectId })
      .populate('assignedTo', 'name email')
      .sort({ deadline: 1 });

    // Map to simple objects for CSV export
    return tasks.map((task) => ({
      TaskId: task._id.toString(),
      Title: task.title,
      Description: task.description,
      AssignedTo: task.assignedTo ? task.assignedTo.name : '',
      Status: task.status,
      Deadline: task.deadline ? task.deadline.toISOString().split('T')[0] : '',
      CreatedAt: task.createdAt.toISOString().split('T')[0],
    }));
  }
}

module.exports = new ReportService();
