const { Task } = require('../../../models'); // Adjust path as needed
const {
  taskSchema, // Joi schema for task validation (you can define accordingly)
} = require('../../../validators');
const { log } = require('../../../utils/debugger');
const { logActivity } = require('../../../utils/logActivityUtil');

class TaskService {
  // Create new task
  async createTask({ body, userId }) {
    try {
      const {
        projectId,
        title,
        description,
        assignedTo,
        status,
        deadline,
        attachments,
      } = body;

      // Basic validation (you can replace with Joi validation)
      const { error } = taskSchema.validate(body);
      if (error) throw new Error(error.details[0].message);

      if (!projectId) throw new Error('Project ID is required');
      if (!title || title.trim() === '')
        throw new Error('Task title is required');

      const task = new Task({
        projectId,
        title,
        description: description || '',
        assignedTo: assignedTo || null,
        status: status || 'todo',
        deadline: deadline || null,
        attachments: attachments || [],
      });

      await task.save();
      const populatedTask = await task.populate([
        { path: 'projectId', select: 'title' },
        { path: 'assignedTo', select: 'name email' },
      ]);
      await Promise.all([
        logActivity({
          taskId: populatedTask._id,
          projectId: populatedTask.projectId._id,
          projectTitle: populatedTask.projectId.title, //  get project title
          user: userId, //  createdBy is passed in the body
          action: 'created',
          detail: 'Task created successfully',
        }),
        logActivity({
          taskId: populatedTask._id,
          projectId: populatedTask.projectId._id,
          projectTitle: populatedTask.projectId.title, // get project title
          user: populatedTask.assignedTo._id, // createdBy is passed in the body
          action: 'assigned',
          detail: 'Task assigned successfully',
        }),
      ]);

      return populatedTask;
    } catch (err) {
      throw err;
    }
  }

  // Get tasks by project with optional filters
  async getTasksByProject(projectId, filter = {}) {
    try {
      // if (!projectId) throw new Error('Project ID is required');

      // Default page & limit if not provided
      const page = parseInt(filter?.page, 10) || 1;
      const limit = parseInt(filter?.limit, 10) || 10;

      if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be positive integers');
      }

      const skip = (page - 1) * limit;
      let query = {};
      if (projectId) {
        query.projectId = projectId;
      }
      if (filter?.status) {
        query.status = filter.status;
      }
      if (filter?.assignedTo) {
        query.assignedTo = filter.assignedTo;
      }

      const [tasks, totalTasks] = await Promise.all([
        Task.find(query)
          .populate([
            { path: 'assignedTo', select: 'name email' },
            { path: 'projectId', select: 'title' },
          ])
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        Task.countDocuments(query),
      ]);

      return {
        tasks,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalRecord: totalTasks,
          totalPages: Math.ceil(totalTasks / limit),
        },
      };
    } catch (err) {
      throw err;
    }
  }

  // Get single task by ID
  async getTaskById(taskId) {
    try {
      const task = await Task.findById(taskId).populate([
        {
          path: 'assignedTo',
          select: 'name email',
        },
        { path: 'comments.user', select: 'name email' },
      ]);
      if (!task) throw new Error('Task not found');
      return task;
    } catch (err) {
      throw err;
    }
  }

  // Update task details
  async updateTask({ params, body, userId }) {
    try {
      const taskId = params.taskId;
      const { title, description, assignedTo, status, deadline, attachments } =
        body;

      const updates = {};
      if (title !== undefined) updates.title = title;
      if (description !== undefined) updates.description = description;
      if (assignedTo !== undefined) updates.assignedTo = assignedTo;
      if (status !== undefined) updates.status = status;
      if (deadline !== undefined) updates.deadline = deadline;
      if (attachments !== undefined) updates.attachments = attachments;

      const task = await Task.findByIdAndUpdate(taskId, updates, {
        new: true,
        runValidators: true,
      }).populate([
        { path: 'projectId', select: 'title' },
        { path: 'assignedTo', select: 'name email' },
        { path: 'comments.user', select: 'name email' },
      ]);

      if (!task) throw new Error('Task not found');

      await logActivity({
        taskId: task._id,
        projectId: task.projectId._id,
        projectTitle: task.projectId.title, // get project title
        user: userId, // Assuming updatedBy is passed in the body
        action: 'updated',
        detail: 'Task updated successfully with status: ' + task.status,
      });

      return task;
    } catch (err) {
      throw err;
    }
  }

  // Delete a task
  async deleteTask({ taskId, userId }) {
    try {
      const task = await Task.findByIdAndDelete(taskId).populate([
        { path: 'projectId', select: 'title' },
      ]);
      if (!task) throw new Error('Task not found');
      await logActivity({
        taskId: task._id,
        projectId: task.projectId._id,
        projectTitle: task.projectId.title, // get project title
        user: userId, // Assuming deletedBy is passed in the body
        action: 'deleted',
        detail: 'Task deleted successfully',
      });
      return { success: true, message: 'Task deleted successfully' };
    } catch (err) {
      throw err;
    }
  }

  // Add a comment to a task
  async addCommentToTask(req, res, next) {
    try {
      const taskId = req.params.taskId;
      const { message } = req.body;
      const userId = req.user.userId; // Assumes auth middleware

      if (!message || message.trim() === '')
        throw new Error('Comment message is required');

      // Create comment object
      const comment = {
        user: userId,
        message,
      };

      // Push comment into the task's comments array
      const task = await Task.findByIdAndUpdate(
        taskId,
        { $push: { comments: comment } },
        { new: true }
      ).populate([
        { path: 'comments.user', select: 'name email' },
        { path: 'projectId', select: 'title' },
      ]); // Populate user info in comments

      if (!task) throw new Error('Task not found');

      await logActivity({
        taskId: task._id,
        projectId: task.projectId._id,
        projectTitle: task.projectId.title, // get project title
        user: req.user.userId, // user is authenticated
        action: 'commented',
        detail: `${message}`,
      });

      return task.comments; // Return updated comments array
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new TaskService();
