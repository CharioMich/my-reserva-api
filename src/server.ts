/**
 * @copywrite 2025 C.Michalakis 
 * @license Apache-2.0
 */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

import limiter from './lib/express_rate_limit.ts'
import { connectToDatabase, disconnectFromDatabase } from "./lib/mongoose.ts";

import routes from "./routes/index.ts";

const app = express();

// Apply CORS middleware
app.use(cors({
  origin: ['http://localhost:5173'] // port 5173 for React
}));

// Enable JSON request body parsing
app.use(express.json());

// Enables URL-encoded body parsing. 'extended: true' -> allows rich objects (nested) and arrays via qs library
app.use(express.urlencoded( {extended: true }))

app.use(cookieParser());

// Compresses response packets to reduce payload size and improve performance
app.use(compression({
    threshold: 1024,      // Only compress responses > 1KB
  })
);

// 'Helmet' enhances security by setting some extra HTTTP Headers
app.use(helmet());

// Use express-rate-limit for extra security. Prevent brute-force & denial of service attacks. Send a 429 (Too many Requests) when limit is exceeded 
app.use(limiter);




/**
 * START Server
 * Using IIFE-Immediately Invoked Async Function Expression to start the server so we can encapsulate the logic 
 * and use async connections at the top-level code.
 */
(async () => {
  try {
    await connectToDatabase();

    app.use('/api', routes);

    app.listen(process.env.PORT, () => {
      console.log(`Server up and running on: http://localhost:${process.env.PORT}`);
    });


  } catch (err) {
    console.log('Failed to start server. Error: ', err);
  }
})();


/**
 * Controlled server shutdown with logging
 */
const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
     console.log("Server SHUTDOWN.");
     process.exit(0);
  } catch(err) {
    console.log("Error during server shutdown. Error: ", err);
  }
};

/**
 * 'SIGTERM' -> when stopping a process ('kill' command)
 * 'SIGINT' -> 'Ctrl + C' (Process Interrupt)
 *  So in the above cases we call handleServerShutdown to stop server more smoothly and disconnect from the DB
 */
process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
 


