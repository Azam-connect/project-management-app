const Joi = require('joi');

// Joi validation schema for task creation/updation
const taskSchema = Joi.object({
  projectId: Joi.string().hex().length(24).required().messages({
    'string.length': 'Project ID must be 24 characters',
    'string.hex': 'Project ID must be a valid hex',
    'any.required': 'Project ID is required',
  }),
  title: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Task title is required',
    'string.min': 'Task title must be at least 3 characters',
    'any.required': 'Task title is required',
  }),
  description: Joi.string().allow('').max(500).messages({
    'string.max': 'Description can be max 500 characters',
  }),
  assignedTo: Joi.string().hex().length(24).allow(null).messages({
    'string.length': 'Assigned user ID must be 24 characters',
    'string.hex': 'Assigned user ID must be a valid hex',
  }),
  status: Joi.string()
    .valid('todo', 'in-progress', 'testing', 'done')
    .default('todo')
    .messages({
      'any.only': 'Status must be one of todo, in-progress, testing, or done',
    }),
  deadline: Joi.date().allow(null),
  attachments: Joi.array().items(Joi.string()).default([]),
});

module.exports = { taskSchema };
