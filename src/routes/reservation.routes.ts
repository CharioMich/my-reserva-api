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


/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get all reservations (admin only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Authentication Error
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticate, authorize([Roles.Admin]), getAllReservations);


/**
 * @swagger
 * /reservations/current:
 *   get:
 *     summary: Get reservations of current logged-in user
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *        200:
 *         description: List of user's reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *        400:
 *          description: User ID not found in request
 *        500:
 *         description: Internal server error
 */
router.get(
  '/current',
  authenticate,
  authorize([Roles.User]),
  getReservationsByCurrentUser
);


/**
 * @swagger
 * /reservations/{date}:
 *   get:
 *     summary: Get reservations for a specific date (admin only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: List of reservations for the given date with user info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Authentication Error
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:date',
  authenticate,
  authorize([Roles.Admin]),
  reservationDateRequestValidator,
  validateRequest,
  getReservationsByDateWithUser
);


/**
 * @swagger
 * /reservations/new:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Authentication Error
 *       403:
 *         description: Unauthorized
 *       409:
 *         description: Validation error - Duplicate Key
 *       500:
 *         description: Internal server error
 */
router.post(
  '/new', 
  authenticate, 
  authorize([Roles.Admin, Roles.User]), 
  newReservationValidator, 
  validateRequest,
  newReservation
);


/**
 * @swagger
 * /reservations/new/{date}:
 *   get:
 *     summary: Get available reservations for a given date (user only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date to check availability (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of reserved hours for that date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservedHours:
 *                   type: array
 *                   items:
 *                     type: string
 *                     pattern: "^\\d{2}:(00|30)$"
 *       401:
 *         description: Authentication Error
 *       403:
 *         description: Unauthorized
 *       409:
 *         description: Validation error 
 *       500:
 *         description: Internal server error
 */
router.get(
  '/new/:date',
  authenticate,
  authorize([Roles.User]),
  reservationDateRequestValidator,
  validateRequest,
  getReservationsByDate
);


/**
 * @swagger
 * /reservations/{reservationId}:
 *   delete:
 *     summary: Delete a reservation by ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the reservation
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *       401:
 *         description: Authentication Error
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/:reservationId', 
  authenticate, 
  authorize([Roles.Admin, Roles.User]), 
  param('reservationId').notEmpty().isMongoId().withMessage('Invalid reservation ID'), // Validate request parameter 'reservationId'
  validateRequest, 
  deleteReservationById
);


export default router;