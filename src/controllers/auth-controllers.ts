// Node Modules
import type { Request, Response } from "express";

// Custom modules
import ENV from "../lib/env.ts";
import { generateAccessToken, generateRefreshToken } from "../lib/jwt.ts";
import refreshToken from "./refresh-token-controller.ts";

// Models
import User from "../models/user.model.ts";
import Token from "../models/token.ts";

// Types
import type { IUser, IUserPublic } from "../types/types.ts";
type UserData = Pick<IUser, 'email' | 'password'>  // declare a new type from IUser, only keeping email and password

// TODO import LOGGER, change console.logs to LOGGER...

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
      role,
    });

    // User details to be returned to the frontend via the access_token
    const publicUser: IUserPublic = {
      username, 
      email,
      firstname, 
      lastname,
      phoneNumber,
      role
    };

    // Generate access token and refresh token for new user 
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Store refresh token in DB
    await Token.create({ token: refreshToken, userId: newUser._id });
    console.log('Refresh token created for user: ', newUser.username);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Prevents JavaScript in the browser (like document.cookie) from accessing the cookie. XSS (Cross-Site Scripting) -> someone 'injecting' js code into our script
      secure: ENV.NODE_ENV === 'production',  // Only sends the cookie over HTTPS connection when in prod. 
      sameSite: 'strict' // Prevents cookie from being sent with cross-site requests
    })

    res.status(201).json({
      status: true,
      message: 'New user created',
      user: publicUser,
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


/**
 * LOGIN CONTROLLER
 */
export const login = async (req: Request, res: Response): Promise<void> => {

  try {
    const {email} = req.body as UserData;

    const user = await User.findOne({ email }, {username:1, email:1, phoneNumber:1, role:1});

    if (!user) {
      res.status(404).json({
        status: false,
        code: "NotFound",
        message: 'User not found'
      });
      return;
    }

    // // User details to be returned to the frontend via the access_token
    // const publicUser: IUserPublic = {
    //   username: user.username,
    //   email: user.email,
    //   firstname: user.firstname,
    //   lastname: user.lastname,
    //   phoneNumber: user.phoneNumber,
    //   // role: user.role
    // };

    const publicUser: IUserPublic = {
      username: user.username || '', // fallback to empty string
      email: user.email || '',
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      phoneNumber: user.phoneNumber || '', // ensure no undefined
      role: user.role || ''
    };

    // Generate access token and refresh token for new user 
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh token in DB
    await Token.create({ token: refreshToken, userId: user._id });
    console.log('Refresh token created for user: ', user.username);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Protects against XSS (Cross-Site Scripting) attacks (someone injecting js code)
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'strict' // Prevents cookie from being sent with cross-site requests
    });

    // res.cookie('accessToken', accessToken, {
    //   httpOnly: true,
    //   secure: ENV.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 60 * 60 * 1000, // 1h
    //   // path: '/', 
    // });

    res.status(200).json({
      status: true,
      message: 'User logged in',
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
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
};



/**
 * LOGOUT CONTROLLER
 */
export const logout = async (req: Request, res: Response): Promise<void> => {

  try {
    const refreshToken: string = req.cookies.refreshToken;

    if (refreshToken) {
      // Delete the refresh token from the database
      await Token.deleteOne({ token: refreshToken });

      // Clear the refreshToken cookie
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      // // Clear the accessToken cookie
      // res.clearCookie('accessToken', {
      //   httpOnly: true,
      //   secure: ENV.NODE_ENV === 'production',
      //   sameSite: 'strict',
      // });
      
      res.status(200).json({
        status: true,
        message: 'Logged out successfully',
      });
      console.log('User logged out, refresh token cleared.');
    }
  } catch(err) {
    res.status(500).json({
      status: false,
      code: 'ServerError',
      message: 'Internal Server Error',
      error: err
    });
    console.log('Error occured during login. Error: ', err);
  } 
};







