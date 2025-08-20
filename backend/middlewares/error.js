const { errorLogger } = require('../utils/errorlogger');
module.exports = function (err, req, res, next) {
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.details.map((d) => d.message),
    });
  }

  errorLogger.error(err.message, err);
  // Custom application error
  if (err.message) {
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({ errMsg: true, message: err.message });
};
