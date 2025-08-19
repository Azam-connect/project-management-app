const fs = require('fs');
const path = require('path');
const moment = require('moment');

const { createLogger, transports, format } = require('winston');

const mainPath = process.cwd();
const logDir = path.join(mainPath, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const errorLogger = createLogger({
    level: 'info', // Set the log level
    format: format.combine(
        format.timestamp(), // Add timestamp to logs
        format.simple() // Simple log format
    ),
    transports: [
        new transports.Console(), // Log to the console
        new transports.File({
            filename: path.join(logDir, `error_${moment().format('YYYY-MM-DD')}.log`),
        }), // Log to a file name
    ],
});

module.exports = { errorLogger };
