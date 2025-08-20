const mongoose = require('mongoose');
const { PmaDB } = require('../../config/dbConnection');

const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    relatedTask: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    relatedProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  },
  { timestamps: true }
);

const Notification = PmaDB.model(
  'notification',
  NotificationSchema,
  'Notifications'
);
module.exports = { Notification };
