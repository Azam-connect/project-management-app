const {
  registerSchema,
  loginSchema,
  updateUserSchema,
} = require('./v1/user/userValidator');
const { projectSchema } = require('./v1/project/projectValidator');
const { taskSchema } = require('./v1/task/taskValidator');

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  projectSchema,
  taskSchema,
};
