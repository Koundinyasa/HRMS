import * as winston from 'winston';

const { combine, timestamp, printf, errors, json, colorize } = winston.format;

const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] ${stack || message}`;
});

export const winstonConfig = {
  level: 'info',

  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json(),
  ),

  transports: [
    // Console Logs
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        consoleFormat,
      ),
    }),

    // All Logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      level: 'info',
    }),

    // Error Logs Only
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
  ],

  exceptionHandlers: [
    new winston.transports.File({
      filename: 'logs/exceptions.log',
    }),
  ],

  rejectionHandlers: [
    new winston.transports.File({
      filename: 'logs/rejections.log',
    }),
  ],
};
