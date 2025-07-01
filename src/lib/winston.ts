import winston from 'winston';
import { MongoDB } from 'winston-mongodb';

// Custom imports
import ENV from "./env.ts";
import { mongo } from 'mongoose';

const { combine, timestamp, json, printf, errors, colorize, prettyPrint } = winston.format;   // align, printf,

// Hold different logging transports
const transports: winston.transport[] = [];

// If app running in development, add a console transport
if (ENV.NODE_ENV === 'development') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }), // Add colors to log levels
        timestamp({ format: "DD-MM-YYYY HH:mm:sss"}), // Add timestamp
        // prettyPrint(), // show in a nice way in console
        printf(({ level, message, timestamp, ...meta }) => {
          let msg = typeof message === 'object'
            ? JSON.stringify(message)
            : message;

          // Include extra metadata if any
          const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';

          return `[${timestamp}] [${level}]: ${msg}${extra}`; // FIXME level.toUpperCase() won't work
        }),
      )
    })
  );
} else {
  transports.push(   // Write logs in MongoDB in production enviroment
    new winston.transports.MongoDB({  
      level: ENV.LOG_LEVEL,
      db: ENV.MONGODB_URI || '',
      collection: "myReserva_server_logs",
      format: combine(
        timestamp(),
        json(),
      )
    })
  );
}

const logger = winston.createLogger({
  level: ENV.LOG_LEVEL,
  // format: combine(timestamp(), errors({ stack: true }), json()), // no global format needed cause each transport has their own format
  transports,
  silent: ENV.NODE_ENV === 'test' // Disable logging in test enviroment
});

export default logger;