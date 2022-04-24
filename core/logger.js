const { createLogger, transports, format } = require('winston');

let time = {format:'ddd DD-MMM-yy hh:mm:ss A'};
module.exports.logger = createLogger({
    transports: [

        // 0
        new transports.File({
            level: 'error',
            filename: 'log_files/errors/error.log',
            json: true,
            format: format.combine(format.timestamp(time), format.json())
        }),

        // 1
        new transports.File({
            level: 'warn',
            filename: 'log_files/warn/warn.log',
            json: true,
            format: format.combine(format.timestamp(time), format.json())
        }),

        // 2
        new transports.File({
            level: 'info',
            filename: 'log_files/info/info.log',
            json: true,
            format: format.combine(format.timestamp(time), format.json())
        }),

        // 4
        new transports.File({
            level: 'debug',
            filename: 'log_files/debug/debug.log',
            json: true,
            format: format.combine(format.timestamp(time), format.json())
        })
    ]
});