import LOGGER from "../lib/winston.ts";
import ENV from "../lib/env.ts"
// Model
import User from "../models/user.model.ts";
// Types
import type { Request, Response } from "express";

export const getAllReservations = (req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    message: 'RESERVATIONS RESPONSE'
  })
}