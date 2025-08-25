const { TaskService } = require('../../../services');
const { Task } = require('../../../models');

class TaskController {
  async createTask(req, res, next) {
    try {
      const fileUrls = req.files.map(
        (file) => `/uploads/tasks/${file.filename}`
      );
      // Extract other task fields from req.body
      const taskData = {
        ...req.body,
        attachments: fileUrls, // Attach files URLs here
      };
      const task = await TaskService.createTask({
        body: taskData,
        userId: req.user.userId,
      });
      return res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTasksByProject(req, res, next) {
    try {
      const { projectId } = req.params;
      const { userId, role } = req.user;
      let filter = req.query || {};
      if (!['admin', 'tester'].includes(role)) {
        filter.assignedTo = userId;
      }
      const tasks = await TaskService.getTasksByProject(projectId, filter);
      return res.status(200).json({
        success: true,
        message: 'Tasks retrieved successfully',
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req, res, next) {
    try {
      const { taskId } = req.params;
      const task = await TaskService.getTaskById(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Task retrieved successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
      let fileUrls = [];
      if (req.files && req.files.length > 0) {
        fileUrls = req.files.map((file) => `/uploads/tasks/${file.filename}`);
      }

      // Get existing attachments if any, append new files
      let existingAttachments = [];
      if (req.body.existingAttachments) {
        try {
          existingAttachments = JSON.parse(req.body.existingAttachments);
          if (!Array.isArray(existingAttachments)) {
            existingAttachments = [];
          }
        } catch {
          existingAttachments = [];
        }
      }

      // Combine existing + new attachments
      const attachments = existingAttachments.concat(fileUrls);

      // Prepare update data
      const updateData = {
        ...req.body,
        attachments,
      };
      delete updateData.existingAttachments; // remove this field from update data
      const task = await TaskService.updateTask({
        params: req.params,
        body: updateData,
        userId: req.user.userId,
      });
      return res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const task = await TaskService.deleteTask(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }
      return res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  }

  async addCommentToTask(req, res, next) {
    try {
      const updatedTask = await TaskService.addCommentToTask(req, res, next);
      return res.status(200).json({
        success: true,
        message: 'Comment added successfully',
        data: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();
