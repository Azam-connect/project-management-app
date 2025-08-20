const {
  registerSchema,
  loginSchema,
  updateUserSchema,
} = require('./v1/user/userValidator');
const { projectSchema } = require('./v1/project/projectValidator');

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  projectSchema,
};
