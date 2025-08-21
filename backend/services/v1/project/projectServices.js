const { Project } = require('../../../models');
const { projectSchema } = require('../../../validators');
const { logActivity } = require('../../../utils/logActivityUtil');

class ProjectService {
  // Create new project
  async createProject(req, res, next) {
    try {
      const { title, description, teamMembers } = req.body;
      const { error } = projectSchema.validate({
        title,
        description,
        teamMembers,
      });
      if (error) throw new Error(error.details[0].message);
      const createdBy = req.user.userId; // Assuming auth middleware sets this
      const project = new Project({
        title,
        description,
        createdBy,
        teamMembers: teamMembers || [],
      });

      await project.save();
      await logActivity({
        projectId: project._id,
        projectTitle: project.title,
        user: createdBy,
        action: 'created',
        detail: 'Project created successfully',
      });
      return project;
    } catch (err) {
      throw err;
    }
  }

  // Get all projects with pagination
  async getProjects(req, res, next) {
    try {
      // Default page & limit if not provided
      const page = parseInt(req.query.currentPage, 10) || 1;
      const limit = parseInt(req.query.pageSize, 10) || 10;

      if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be positive integers');
      }

      const skip = (page - 1) * limit;
      const [projects, totalProjects] = await Promise.all([
        Project.find()
          .populate('createdBy', 'name email')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        Project.countDocuments(),
      ]); // Newest first

      return {
        projects,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalRecord: totalProjects,
          totalPages: Math.ceil(totalProjects / limit),
        },
      };
    } catch (err) {
      throw err;
    }
  }

  // Get all projects a user is part of
  async getUserProjects(req, res, next) {
    try {
      const userId = (req.params.id || req.user.userId) ?? null; // Get user ID from params or request object
      if (!userId) {
        throw new Error('User ID is required');
      }
      // Default page & limit if not provided
      const page = parseInt(req.query.currentPage, 10) || 1;
      const limit = parseInt(req.query.pageSize, 10) || 10;

      if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be positive integers');
      }

      const skip = (page - 1) * limit;
      const [projects, totalProjects] = await Promise.all([
        Project.find({
          teamMembers: userId,
        })
          .populate([
            { path: 'createdBy', select: 'name email' },
            { path: 'teamMembers', select: 'name email' },
          ])
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        Project.countDocuments(),
      ]); // Newest first

      return {
        projects,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalRecord: totalProjects,
          totalPages: Math.ceil(totalProjects / limit),
        },
      };
    } catch (err) {
      throw err;
    }
  }

  // Get single project by ID with team member details
  async getProjectById(req, res, next) {
    try {
      const projectId = req.params?.id || null;

      if (!projectId) {
        throw new Error('Project ID is required');
      }
      const project = await Project.findById(projectId)
        .populate('createdBy', 'name email')
        .populate('teamMembers', 'name email');
      if (!project) throw new Error('Project not found');
      return project;
    } catch (err) {
      throw err;
    }
  }

  // Update a project (title, description, teamMembers)
  async updateProject(req, res, next) {
    try {
      const projectId = req.params?.id;
      if (!projectId) {
        throw new Error('Project ID is required');
      }
      const { title, description, teamMembers } = req.body;

      const { error } = projectSchema.validate({
        title,
        description,
        teamMembers,
      });
      if (error) throw new Error(error.details[0].message);

      const updates = { title, description, teamMembers };

      const project = await Project.findByIdAndUpdate(projectId, updates, {
        new: true,
        runValidators: true,
      });

      if (!project) throw new Error('Project not found');
      await logActivity({
        projectId: project._id,
        projectTitle: project.title,
        user: req.user.userId, // Assuming auth middleware sets this
        action: 'updated',
        detail: 'Project updated successfully',
      });
      return project;
    } catch (err) {
      throw err;
    }
  }

  // Delete a project
  async deleteProject(req, res, next) {
    try {
      const projectId = req.params?.id || null;

      if (!projectId) {
        throw new Error('Project ID is required');
      }
      const project = await Project.findByIdAndDelete(projectId);
      if (!project) throw new Error('Project not found');
      await logActivity({
        projectId: project._id,
        projectTitle: project.title,
        user: req.user.userId, // Assuming auth middleware sets this
        action: 'deleted',
        detail: 'Project deleted successfully',
      });
      return { success: true };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new ProjectService();
