const mongoose = require('mongoose');
const { PmaDB } = require('../../../config/dbConnection');

const ActivityLogSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'project',
      // required: true,
    },
    projectTitle: { type: String, required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'task' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    action: { type: String, required: true },
    detail: { type: String },
  },
  { timestamps: true }
);

const ActivityLog = PmaDB.model(
  'activitylog',
  ActivityLogSchema,
  'ActivityLogs'
);
module.exports = { ActivityLog };
