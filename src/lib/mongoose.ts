import mongoose from "mongoose"

import ENV from "./env.ts";

/**
 * Connection to the database and logging
 */
export const connectToDatabase = async (): Promise<void> => {
  if (!ENV.MONGODB_URI)
    throw new Error('MongoDB URI missing from .env file.')

  try {
    await mongoose.connect(ENV.MONGODB_URI);
    console.log('Connection to MongoDB established.')
  } catch(err) {
    console.log('Failed to connect to MongoDB. Error: ', err);
  }
}


/**
 * Handles controlled and with-logging disconnection from the database 
 */
export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();

    console.log('Disconnection from MongoDB successfull.');
  } catch(err) {
    console.log('Failed to disconnect from MongoDb. Error: ', err);
  }
}