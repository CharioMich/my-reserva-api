// Imported types for custom RequestWithUser interface
import { type Types } from 'mongoose';
import { Request } from 'express';


export const Roles = {
  Admin: 'admin',
  User: 'user',
} as const;

export type Role = typeof Roles[keyof typeof Roles];


export interface IUser {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstname: string; 
  lastname: string;
  phoneNumber: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IUserPublic = Omit<IUser, 'password' | 'confirmPassword' | 'createdAt' | 'updatedAt' >;


/**
 * A custom interface that extends express' Request type with added 'userId' property
 * We use it when we want to store the userId in the request
 */
export interface RequestWithUser extends Request {
  userId?: Types.ObjectId;
}