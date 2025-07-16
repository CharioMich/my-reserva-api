import { Router } from "express";
import { param } from 'express-validator';

// Controllers
import { 
  getAllReservations, 
  getReservationsByCurrentUser, 
  getReservationsByDateWithUser,
  getReservationsByDate,
  newReservation, 
  deleteReservationById
} from "../controllers/reservation-controllers.ts";

// Types
import { Roles } from '../types/types.ts';

// Middlewares
import authenticate from '../middlewares/authenticate.ts';
import validateRequest from '../middlewares/validate-request.ts';
import authorize from '../middlewares/authorize.ts';
import { reservationDateRequestValidator, newReservationValidator } from "../validators/reservation-validator.ts";


const router = Router();

// Get all reservations. General purpose route
router.get('/', authenticate, authorize([Roles.Admin]), getAllReservations);

// Get current user's reservations
router.get(
  '/current',
  authenticate,
  authorize([Roles.User]),
  getReservationsByCurrentUser
);

// Get reservations by date. (For admin's dashboard)
router.get(
  '/:date',
  authenticate,
  authorize([Roles.Admin]),
  reservationDateRequestValidator,
  validateRequest,
  getReservationsByDateWithUser
);

// New reservation
router.post(
  '/new', 
  authenticate, 
  authorize([Roles.Admin, Roles.User]), 
  newReservationValidator, 
  validateRequest,
  newReservation
);

// Get reservations by date. (For user's new reservation)
router.get(
  '/new/:date',
  authenticate,
  authorize([Roles.User]),
  reservationDateRequestValidator,
  validateRequest,
  getReservationsByDate
);

// Delete reservation by id
router.delete(
  '/:reservationId', 
  authenticate, 
  authorize([Roles.Admin, Roles.User]), 
  param('reservationId').notEmpty().isMongoId().withMessage('Invalid reservation ID'), // Validate request parameter 'reservationId'
  validateRequest, 
  deleteReservationById
);


export default router;