const { ProjectService } = require('../../../services');

class ProjectController {
  async createProject(req, res, next) {
    try {
      const project = await ProjectService.createProject(req, res, next);
      return res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }

  async getProjectById(req, res, next) {
    try {
      const project = await ProjectService.getProjectById(req, res, next);
      return res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  }

  async updateProject(req, res, next) {
    try {
      const updatedProject = await ProjectService.updateProject(req, res, next);
      return res.status(200).json(updatedProject);
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(req, res, next) {
    try {
      await ProjectService.deleteProject(req, res, next);
      return res.status(204).json({ message: 'Project deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getAllProjects(req, res, next) {
    try {
      const projects = await ProjectService.getProjects(req, res, next);
      return res.status(200).json(projects);
    } catch (error) {
      next(error);
    }
  }

  async getUserProjects(req, res, next) {
    try {
      const projects = await ProjectService.getUserProjects(req,res,next);
      return res.status(200).json(projects);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProjectController();
