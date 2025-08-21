const mongoose = require('mongoose');
const { PmaDB } = require('../../../config/dbConnection');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
    role: {
      type: String,
      enum: ['admin', 'developer', 'tester'],
      default: 'developer',
    },
  },
  { timestamps: true }
);

const User = PmaDB.model('user', UserSchema, 'Users');
module.exports = { User };
