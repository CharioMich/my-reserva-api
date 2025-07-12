import { body, param } from 'express-validator';

import Reservation from '../models/reservation.model.ts'; 


export const reservationDateRequestValidator = [
  param('date')
    .trim()
    .notEmpty()
    .withMessage('Date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in ISO format: yyyy-MM-dd')
    .custom((value) => {
      const [year, month, day] = value.split('-').map(Number);
      const dateObj = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`); // ex. .padStart(2, '0') => 9 → '09'

      // Validate actual date correctness (e.g. no 2025-02-30)
      if (
        dateObj.getFullYear() !== year ||
        dateObj.getMonth() + 1 !== month ||
        dateObj.getDate() !== day
      ) {
        throw new Error('Invalid calendar date');
      }

      // Ensure date is today or in the future
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateObj.setHours(0, 0, 0, 0);

      if (dateObj < today) {
        throw new Error('Date must be today or in the future');
      }

      return true;
    }),
]


export const newReservationValidator = [
  body('date')
    .trim()
    .notEmpty()
    .withMessage('Date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Date must be in ISO format: yyyy-MM-dd')
    .custom((value) => {
      const [year, month, day] = value.split('-').map(Number);
      const dateObj = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`); // ex. .padStart(2, '0') => 9 → '09'

      // Validate actual date correctness (e.g. no 2025-02-30)
      if (
        dateObj.getFullYear() !== year ||
        dateObj.getMonth() + 1 !== month ||
        dateObj.getDate() !== day
      ) {
        throw new Error('Invalid calendar date');
      }

      // Ensure date is today or in the future
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateObj.setHours(0, 0, 0, 0);

      if (dateObj < today) {
        throw new Error('Date must be today or in the future');
      }

      return true;
    }),
    
    body('hours')
      .trim()
      .notEmpty()
      .withMessage('Hours is required')
      .matches(/^\d{2}:(00|30)$/)
      .withMessage("Hours field must be in HH:MM format, either full hour or half an hour added (e.g. 16:00 or 16:30)"),
      // .custom(async (hour, {req}) => {  // Check if for the specific date, the requested hour is available or already reserved. UPDATE: Logic moved to controller so we can send error to the frontend
      //       const hourExists = await Reservation.exists( { date: req.body.reservation.date, hours: hour });
      //       if (hourExists) {
      //         throw new Error(`A reservation at ${hour} already exists`)
      //       }
      //     }),

    body("text")
      .trim()
      .optional()
      .isLength({ max: 200 })
      .withMessage("Text must be maximum 200 characters")
]