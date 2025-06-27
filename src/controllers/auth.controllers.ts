import type { Request, Response } from "express";

import ENV from "../lib/env.ts";
import User from "../models/user.model.ts";
import Token from "../models/token.ts";
import type { IUser } from "../types/types.ts";
import { generateAccessToken, generateRefreshToken } from "../lib/jwt.ts";

type UserData = Pick<IUser, 'email' | 'password'>  // declare a new type from IUser, only keeping email and password

/**
 * REGISTER CONTROLLER
 */
export const register = async(req: Request, res: Response): Promise<void> => {

  const {
    username, 
    email,
    password,
    confirmPassword,
    firstname, 
    lastname,
    phoneNumber,
    role,
  } = req.body as IUser;

  // Check if the request has any injected 'admin' role
  if (role === 'admin' && !ENV.WHITELIST_ADMIN_MAILS.includes(email)) {
    res.status(403).json({
      status: false,
      code: 'AuthorizationError',
      message: 'You cannot register as an admin',
    });
    console.error('Not authorized to register as an admin');
    return;
  }

  try {
    const newUser = await User.create({
      username, 
      email,
      password,
      firstname, 
      lastname,
      phoneNumber,
    });

    // Generate access token and refresh token for new user 
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Store refresh token in DB
    await Token.create({ token: refreshToken, userId: newUser._id });
    console.log('Refresh token created for user, ', newUser.username);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Protects against XSS (Cross-Site Scripting) attacks (someone injecting js code)
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'strict' // Prevents cookie from being sent with cross-site requests
    })

    res.status(201).json({
      status: true,
      message: 'New user created',
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
    });
    console.log('User registred succesfully.');
  } catch(err) {
    res.status(500).json({
      status: false,
      code: 'ServerError',
      message: 'Internal Server Error',
      error: err
    })
    console.log('Failed to register new user. Error: ', err);
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {

  try {
    const {email} = req.body as UserData;

    const user = await User.findOne({ email }, {username:1, email:1, password:1, role:1});

    if (!user) {
      res.status(404).json({
        status: false,
        code: "NotFound",
        message: 'User not found'
      });
      return;
    }

    // Generate access token and refresh token for new user 
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in DB
    await Token.create({ token: refreshToken, userId: user._id });
    console.log('Refresh token created for user, ', user.username);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Protects against XSS (Cross-Site Scripting) attacks (someone injecting js code)
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'strict' // Prevents cookie from being sent with cross-site requests
    });

    res.status(201).json({
      status: true,
      message: 'User logged in',
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
    
    console.log('User logged in succesfully.');

  } catch(err) {
    res.status(500).json({
      status: false,
      code: 'ServerError',
      message: 'Internal Server Error',
      error: err
    });
    console.log('Error occured during login. Error: ', err);
  } 
}



