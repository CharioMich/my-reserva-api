import { Router } from "express";

// Controllers
import { getAllReservations, getReservationsByCurrentUser, getReservationsByDate, newReservation } from "../controllers/reservation-controllers.ts";

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

// Get reservations by date. (For admin's dashboard)
router.get(
  '/:date',
  authenticate,
  authorize([Roles.Admin]),
  reservationDateRequestValidator,
  validateRequest,
  getReservationsByDate
);

// Get current user's reservations
router.get(
  '/current',
  authenticate,
  authorize([Roles.User]),
  getReservationsByCurrentUser
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


export default router;