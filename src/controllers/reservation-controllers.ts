import LOGGER from "../lib/winston.ts";
import ENV from "../lib/env.ts"
// Model
import Reservation, { type IReservation } from '../models/reservation.model.ts';
// Types
import type { Request, Response } from "express";
import { RequestWithUser } from "../types/types.ts";
import { Types } from "mongoose";


/**
 * GET ALL RESERVATIONS
 */
export const getAllReservations = async (req: Request, res: Response) => {

  try {
    // TODO Implement pagination/limit
    const reservations = await Reservation.find({}, {__v: 0});

    res.status(200).json({
      status: true,
      reservations
    });
  } catch (err) {
    res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        error: err
      });
    LOGGER.error('Error getting all reservations. Error: ', err);
  }
}


/**
 * GET RESERVATIONS BY DATE. USER DATA INCLUDED
 */
export const getReservationsByDateWithUser = async (req: Request, res: Response) => {
  const date = req.params.date;
  // Date validated via middleware.
  try {
    const reservations = await Reservation.find({date: date}, {__v: 0}).populate('userId', '-password -__v');

    res.status(200).json(
      reservations
    );
  } catch (err) {
    res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        error: err
      });
    LOGGER.error('Error getting reservations by date. Error: ', err);
  }
}


/**
 * GET RESERVATIONS BY DATE. USER DATA EXCLUDED. 
 * For updating reserved times on user's new-reservation page.
 */
export const getReservationsByDate = async (req: Request, res: Response) => {
  const date = req.params.date;
  // Date validated via middleware.
  try {
    const reservations = await Reservation.find({ date: date }, { __v: 0, userId: 0, text: 0 }); // exclude other users' data. 

    res.status(200).json(
      reservations
    );
  } catch (err) {
    res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        error: err
      });
    LOGGER.error('Error getting reservations by date. Error: ', err);
  }
}


/**
 * GET RESERVATIONS BY CURRENT USER
 */
export const getReservationsByCurrentUser = async (req: RequestWithUser, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
 
    if (!userId) {
      res.status(400).json({
        code: 'MissingUserId',
        message: 'User ID not found in request',
      });
    }

    const reservations: IReservation[] = await Reservation.find({userId: new Types.ObjectId(userId)}, {__v: 0});

    res.status(200).json(
      reservations
    );
  } catch (err) {
    res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        error: err
      });
    LOGGER.error('Error getting reservations by user. Error: ', err);
  }
}


/**
 * MAKE A NEW RESERVATION
 */
export const newReservation = async (req: RequestWithUser, res: Response) => {
  const userId = req.userId;

  try {
    const { date, hours, text } = req.body as IReservation;

    const hourExists = await Reservation.exists( { date: date, hours: hours });

    if (hourExists) {
      LOGGER.warn(`A reservation at time: ${hours} already exists`);
      res.status(409).json({
      status: false,
      code: 'DuplicateKey',
      message: `A reservation at time: ${hours} already exists`
      });
    }

    await Reservation.create({ date, hours, text, userId });

    LOGGER.info(`Reservation for userId: ${userId} on ${date} at ${hours} confirmed.`)

    res.status(201).json({
      status: true,
      message: "Reservation confirmed",
    });
  } catch(err) {
    res.status(500).json({
      status: false,
      code: 'ServerError',
      message: 'Internal Server Error',
      error: err
    })
    LOGGER.error('Failed to make new reservation. Error: ', err);
  }
}


/**
 * DELETE RESERVATION BY ID
 */
export const deleteReservationById = async (req: Request, res: Response) => {
  const reservationId = req.params.reservationId;
  try {
    const reservation = await Reservation.findById(reservationId, { __v: 0 }).lean().exec();

    if (!reservation) {
      res.status(404).json({
        status: false, 
        code: 'NotFound',
        message: 'Reservation not found',
      })
      return;
    }

    await Reservation.deleteOne({ _id: reservationId });

    res.status(200).json({
      status: true,
      message: 'Reservation deleted'
    });
    return;
  } catch (err) {
    res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        error: err
      });
    LOGGER.error(`Error deletting user with id ${reservationId}. Error: `, err);
  }
}

