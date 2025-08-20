const { User } = require('./v1/user/userModel');
const { Project } = require('./v1/project/projectModel');
const { Task } = require('./v1/task/taskModel');
const { ActivityLog } = require('./v1/activitylog/activityLogModel');
const { Notification } = require('./v1/notification/notificationModel');

module.exports = { User, Project, Task, ActivityLog, Notification };
