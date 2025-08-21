const mongoose = require('mongoose');
const { PmaDB } = require('../../../config/dbConnection');

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const TaskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'project',
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'testing', 'done', 'rejected'],
      default: 'todo',
    },
    deadline: { type: Date },
    attachments: [{ type: String }],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

const Task = PmaDB.model('task', TaskSchema, 'Tasks');
module.exports = { Task };
