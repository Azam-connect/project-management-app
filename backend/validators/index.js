const {
  registerSchema,
  loginSchema,
  updateUserSchema,
} = require('./v1/user/userValidator');

module.exports = { registerSchema, loginSchema, updateUserSchema };
