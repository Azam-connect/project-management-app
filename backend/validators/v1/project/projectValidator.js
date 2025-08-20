const Joi = require('joi');

// Joi validation schema for project creation/updation
const projectSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Project title is required',
    'string.min': 'Project title must be at least 3 characters',
    'any.required': 'Project title is required',
  }),
  description: Joi.string().allow('').max(500).messages({
    'string.max': 'Description can be max 500 characters',
  }),
  teamMembers: Joi.array().items(Joi.string().hex().length(24)).messages({
    'string.hex': 'Team member IDs must be valid MongoDB ObjectId',
    'string.length': 'Team member ID must be 24 characters',
  }),
});

module.exports = { projectSchema };
