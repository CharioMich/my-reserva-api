import type { Request, Response } from "express";
import User from "../models/user.model.ts";
import type { IUser } from "../types/types.ts";


const register = async(req: Request, res: Response): Promise<void> => {

  const {
    username, 
    email,
    password,
    firstname, 
    lastname,
    phoneNumber,
  } = req.body as IUser;

  try {
    const newUser: IUser = await User.create({
      username, 
      email,
      password,
      firstname, 
      lastname,
      phoneNumber,
    });

    res.status(201).json({
      status: true,
      message: 'New user created',
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch(err) {
    res.status(500).json({
      status: false,
      code: 'ServerError',
      message: 'Internal Server Error',
      error: err
    })
    console.log('Failed to register new user. Error: ', err);
  }
}

export default register;