const { errorLogger } = require('../utils/errorlogger');
module.exports = function (err, req, res, next) {
    errorLogger.error(err.message, err);
    return res.status(500).json({ errMsg: true, message: err.message });
};
