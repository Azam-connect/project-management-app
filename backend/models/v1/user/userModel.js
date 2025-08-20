const mongoose = require('mongoose');
const { PmaDB } = require('../../../config/dbConnection');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
  },
  { timestamps: true }
);

const User = PmaDB.model('user', UserSchema, 'Users');
module.exports = { User };
