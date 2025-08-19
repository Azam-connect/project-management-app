const mongoose = require('mongoose');
const path = require('path');
const { log } = require("../utils/debugger")
const { errorLogger } = require('../utils/errorlogger');


const connectDatabase = () => {
    const dbUrl = process.env.DB_URL;
    const options = {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        maxIdleTimeMS: 10000,
    };

    const db = mongoose.createConnection(dbUrl, options);

    db.on('error', function (error) {
        log(`MongoDB :: connection ${this.name} ${JSON.stringify(error)}`);
        errorLogger.error(error.message, error);
        db.close().catch(() =>
            log(`MongoDB :: failed to close connection ${this.name}`)
        );
    });
    db.on('connected', function () {
        mongoose.set('debug', function (col, method, query, doc) {
            log(
                `MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(
                    query
                )},${JSON.stringify(doc)})`
            );
        });
        log(`MongoDB :: connected ${this.name}`);
    });

    db.on('disconnected', function () {
        log(`MongoDB :: disconnected ${this.name}`);
    });
    return db;
};
const PmaUDB = connectDatabase();

module.exports = { PmaUDB };
