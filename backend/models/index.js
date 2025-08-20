const { User } = require('./user/userModel');
const { Project } = require('./project/projectModel');
const { Task } = require('./task/taskModel');
const { ActivityLog } = require('./activitylog/activityLogModel');
const { Notification } = require('./notification/notificationModel');

module.exports = { User, Project, Task, ActivityLog, Notification };
