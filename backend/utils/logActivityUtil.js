const { ActivityLog } = require('../models');
const { log } = require('./debugger');

const logActivity = async (activityDate) => {
  try {
    const activityLog = new ActivityLog(activityDate);
    await activityLog.save();
  } catch (error) {
    log('Error logging activity:', error);
    throw error;
  }
};

module.exports = { logActivity };
