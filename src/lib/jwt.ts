import { Types } from "mongoose";
import jwt from 'jsonwebtoken';

import ENV from "./env.ts";


export const generateAccessToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, ENV.JWT_ACCESS_SECRET, {
    expiresIn: ENV.ACCESS_TOKEN_EXPIRY, 
    // expiresIn: 20,  // 20 sec for testing refresh_token 
    subject: 'accessApi'
  });
};

export const generateRefreshToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, ENV.JWT_REFRESH_SECRET, {
    expiresIn: ENV.REFRESH_TOKEN_EXPIRY,
    subject: 'refreshToken'
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ENV.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (refreshToken: string) => {
  return jwt.verify(refreshToken, ENV.JWT_REFRESH_SECRET);
};