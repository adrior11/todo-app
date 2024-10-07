const winston = require('winston');

export const jsonFormatter = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
);

export const simpleFormatter = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
    })
);

