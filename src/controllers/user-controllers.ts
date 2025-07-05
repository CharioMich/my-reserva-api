import LOGGER from "../lib/winston.ts";
import ENV from "../lib/env.ts"
// Model
import User from "../models/user.model.ts";
// Types
import type { Request, Response } from "express";
import type { IUser, RequestWithUser } from "../types/types.ts";

/**
 * GET CURRENT USER CONTROLLER
 */
export const getCurrentUser = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId, { __v: 0 }).lean().exec();

    res.status(200).json(
      user,
    );
    return;
  } catch (err) {
    res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        error: err
      });
    LOGGER.error('Error getting current user. Error: ', err);
  }
};

/**
 * UPDATE CURRENT USER CONTROLLER
 */
export const updateCurrentUser = async (req: RequestWithUser, res: Response): Promise<void> => {
  const userId = req.userId;
  const {
    username, 
    email,
    password, 
    firstname, 
    lastname,
    phoneNumber,
  } = req.body;

  try {
    const user = await User.findById(userId).select('+password -__v').exec();

    if (!user) {
      res.status(404).json({
        status: false, 
        code: 'NotFound',
        message: 'User not found',
      })
      return;
    }

    if (username) user.username = username;
    if(email) user.email = email;
    if (password) user.password = password;
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    // await user.save();
    const updated = await User.findOneAndUpdate({ _id: userId }, user, { new: true }).lean();  // new: true -> returns updated user | .lean() -> returns json()

    LOGGER.info(`User with id: ${userId} updated successfully.`, updated);

    res.status(200).json({
      updated
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error
    })
    LOGGER.error(`Failed to update user with id ${userId}. Error: `, error);
  }
}


/**
 * DELETE CURRENT USER CONTROLLER
 */
export const deleteCurrentUser = async (req: RequestWithUser, res: Response): Promise<void> => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        status: false, 
        code: 'NotFound',
        message: 'User not found',
      })
      return;
    }
    await User.findOneAndDelete({_id: userId});

    res.status(200).json({
      status: true,
      message: 'User deleted successfully.'
    })
  } catch(error) {
    res.status(500).json({
      status: false,
      code: 'ServerError',
      message: 'Internal Server Error',
      error: error
    })
    LOGGER.error('Failed to delete user. Error: ', error);
  }
}


/**
 * GET ALL USERS CONTROLLER
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
  //   PAGINATED
  //   const page = parseInt(req.query.page as string) || 1;                            // Default to page 1
  //   const limit = parseInt(req.query.limit as string) || ENV.DEFAULT_RES_LIMIT;    // Default to 10 users per page
  //   const skip = (page - 1) * limit;

  //   const [users, total] = await Promise.all([
  //     User.find().skip(skip).limit(limit),
  //     User.countDocuments()
  //   ]);

  //   res.status(200).json({
  //     status: true,
  //     users,
  //     pagination: {
  //       total,
  //       page,
  //       limit,
  //       totalPages: Math.ceil(total / limit)
  //     }

    const users = await User.find({}, {__v: 0}); // TODO implement above -> limit | pagination

    res.status(200).json({
      status: true,
      users
    })
  } catch (err) {
    res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        error: err
      });
    LOGGER.error('Error getting all users. Error: ', err);
  }
} 


/**
 * GET USER BY ID
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId, { __v: 0 }).lean().exec();

    if (!user) {
      res.status(404).json({
        status: false, 
        code: 'NotFound',
        message: 'User not found',
      })
      return;
    }

    res.status(200).json(
      user,
    );
    return;
  } catch (err) {
    res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        error: err
      });
    LOGGER.error(`Error getting user with id ${userId}. Error: `, err);
  }
}


/**
 * DELETE USER BY ID
 */
export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId, { __v: 0 }).lean().exec();

    if (!user) {
      res.status(404).json({
        status: false, 
        code: 'NotFound',
        message: 'User not found',
      })
      return;
    }

    User.findByIdAndDelete(userId);

    res.status(200).json({
      status: true,
      message: 'User deleted'
    });
    return;
  } catch (err) {
    res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        error: err
      });
    LOGGER.error(`Error deletting user with id ${userId}. Error: `, err);
  }
}