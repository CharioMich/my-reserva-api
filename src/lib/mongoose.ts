import mongoose from "mongoose"

import ENV from "./env.ts";

import LOGGER from './winston.ts';

/**
 * Connection to the database and logging
 */
export const connectToDatabase = async (): Promise<void> => {
  if (!ENV.MONGODB_URI)
    throw new Error('MongoDB URI missing from .env file.')

  try {
    await mongoose.connect(ENV.MONGODB_URI);
    LOGGER.info('Connection to MongoDB established.')
  } catch(err) {
    LOGGER.error('Failed to connect to MongoDB. Error: ', err);
  }
}


/**
 * Handles controlled and with-logging disconnection from the database 
 */
export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();

    LOGGER.info('Disconnection from MongoDB successfull.');
  } catch(err) {
    LOGGER.error('Failed to disconnect from MongoDb. Error: ', err);
  }
}