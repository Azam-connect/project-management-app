const Joi = require('joi');
// Validation schemas using Joi
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name should have at least 3 characters',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password should be at least 6 characters long',
    'string.empty': 'Password is required',
  }),
  role: Joi.string()
    .valid('admin', 'developer', 'tester')
    .default('developer')
    .messages({
      'any.only': 'Role must be one of admin, developer, or tester',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  role: Joi.string().valid('admin', 'developer', 'tester').messages({
    'any.only': 'Role must be one of admin, developer, or tester',
  }),
})
  .or('name', 'email', 'password', 'role')
  .messages({
    'object.missing':
      'At least one field (name, email, or password) is required to update',
  });

module.exports = { registerSchema, loginSchema, updateUserSchema };
