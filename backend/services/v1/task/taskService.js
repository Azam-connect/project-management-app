const { Task } = require('../../../models'); // Adjust path as needed
const {
  taskSchema, // Joi schema for task validation (you can define accordingly)
} = require('../../../validators');

class TaskService {
  // Create new task
  async createTask({ body }) {
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

      return task;
    } catch (err) {
      throw err;
    }
  }

  // Get tasks by project with optional filters
  async getTasksByProject(projectId, filter = {}) {
    try {
      if (!projectId) throw new Error('Project ID is required');

      // Default page & limit if not provided
      const page = parseInt(filter?.page, 10) || 1;
      const limit = parseInt(filter?.limit, 10) || 10;

      if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be positive integers');
      }

      const skip = (page - 1) * limit;
      let query = { projectId };
      if (filter?.status) {
        query.status = filter.status;
      }

      const [tasks, totalTasks] = await Promise.all([
        Task.find(query)
          .populate('assignedTo', 'name email')
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
          totalTasks,
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
      ]);
      if (!task) throw new Error('Task not found');
      return task;
    } catch (err) {
      throw err;
    }
  }

  // Update task details
  async updateTask({ params, body }) {
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
      });

      if (!task) throw new Error('Task not found');

      return task;
    } catch (err) {
      throw err;
    }
  }

  // Delete a task
  async deleteTask(taskId) {
    try {
      const task = await Task.findByIdAndDelete(taskId);
      if (!task) throw new Error('Task not found');
      return { success: true, message: 'Task deleted successfully' };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new TaskService();
