const { Notification } = require('../models');
const { log } = require('./debugger');

const addNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
  } catch (error) {
    log('Error adding notification:', error);
    throw error;
  }
};

module.exports = { addNotification };
