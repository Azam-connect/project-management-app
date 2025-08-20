const {TaskService} = require("../../../services");
const {Task} = require("../../../models");

class TaskController{
    async createTask(req,res,next){
        try {
            const task = await TaskService.createTask(req, res, next);
            return res.status(201).json({
                success: true,
                message: 'Task created successfully',
                data: task
            });
        } catch (error) {
            next(error);
        }
    }

    async getTasksByProject(req, res, next) {
        try {
            const { projectId } = req.params;
            const filter = req.query || {};
            const tasks = await TaskService.getTasksByProject(projectId, filter);
            return res.status(200).json({
                success: true,
                message: 'Tasks retrieved successfully',
                data: tasks
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
                    message: 'Task not found'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Task retrieved successfully',
                data: task
            });
        } catch (error) {
            next(error);
        }
    }

    async updateTask(req, res, next) {
        try {
            const task = await TaskService.updateTask(req, res, next);
            return res.status(200).json({
                success: true,
                message: 'Task updated successfully',
                data: task
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
                    message: 'Task not found'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Task deleted successfully',
                data: task
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TaskController();
