const { ActivityLog } = require('../models');

const logActivity = async (activityDate) => {
  try {
    const activityLog = new ActivityLog(activityDate);
    await activityLog.save();
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

module.exports = { logActivity };
