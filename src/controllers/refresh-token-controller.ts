// Node modules
// import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"; // Will throw an error cause CommonJS module (jsonwebtoken) doesn't support named exports in ESM context (--loader ts-node/esm)
import jwt from "jsonwebtoken";
const { JsonWebTokenError, TokenExpiredError } = jwt;
// Custom Modules
import { verifyRefreshToken, generateAccessToken } from "../lib/jwt.ts";
// Model 
import Token from "../models/token.ts";
// Types
import { Request, Response } from "express";
import { Types } from 'mongoose';

// TODO import LOGGER, change console.logs to LOGGER...

/**
 * REFRESH TOKEN CONTROLLER
 * Gets the refreshToken (refToken) from the request cookie and checks if it is present and valid.
 * If yes (valid) it generates an access token and sends it back with the response otherwise it throws corresponding error
 */
const refreshToken = async (req: Request, res: Response) => {
  const refToken: string = req.cookies.refreshToken;

  try {
    const tokenExists = Token.exists({ token: refToken });

    if (!tokenExists) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid refresh token'
      });
      return;
    }

    // Verify refresh token
    const jwtPayload = verifyRefreshToken(refToken) as { userId: Types.ObjectId };

    const accessToken = generateAccessToken(jwtPayload.userId);

    res.status(200).json({
      status: true,
      accessToken,
    });

  } catch(err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Refresh token expired. Please login again'
      });
      return;
    }
    if (err instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid refresh token'
      });
      return;
    }
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err
    });
    console.log('Error during refresh token. Error: ', err);
    return;
  }
};

export default refreshToken;