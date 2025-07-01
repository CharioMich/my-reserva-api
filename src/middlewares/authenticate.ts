// Node Modules
import jwt from "jsonwebtoken";
const { JsonWebTokenError, TokenExpiredError } = jwt;

// Custom Modules
import { verifyAccessToken } from "../lib/jwt.ts";

// Types
import { Request, Response, NextFunction } from "express";
import type { Types } from 'mongoose';

// Custom types
import { type RequestWithUser } from '../types/types.ts'



const authenticate = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  // If no Bearer token, respond with 401 unauthorized
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      status: false,
      code: 'AuthenticationError',
      message: 'Access denied, no token provided'
    });
    return;
  }

  // Split token from 'Bearer '
  const [_, token] = authHeader.split(' ');  // const token = authHeader && authHeader.split(' ')[1];
 
  try {
    // Verify token and get userId from payload
    const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

    // Attach userId to request object so we can use it later. This is where we need the custom declared interface RequestWithUser
    req.userId = jwtPayload.userId;
    // console.log('>>> req.userId: ', req.userId);

    // Proceed to next middleware or route handler (controller)
    return next();
  } catch (err) {
    // Handle expired token error
    if (err instanceof TokenExpiredError) {
      res.status(401).json({
        status: false,
        code: 'AuthenticationError',
        message: 'Access token expired. Request a new one with refresh-token',
      });
      return;
    }
    // Handle invalid token error
    if (err instanceof JsonWebTokenError) {
      res.status(401).json({
        status: false,
        code: 'AuthenticationError',
        message: 'Invalid access token',
      });
      return;
    }
    // Handle any other errors
    res.status(500).json({
      status: false,
      code: 'ServerError',
      message: 'Internal Server Error',
      error: err,
    });
    console.log('Error during authentication.')
    return;
  }
}

export default authenticate;

