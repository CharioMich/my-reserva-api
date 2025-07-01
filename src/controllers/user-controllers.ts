import LOGGER from "../lib/winston.ts";
// Model
import User from "../models/user.model.ts";
// Types
import { type Response } from "express";
import type { RequestWithUser } from "../types/types.ts";


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


export const updateCurrentUser = async (req: RequestWithUser, res: Response): Promise<void> => {

}