import { body } from 'express-validator';
import bcrypt from 'bcrypt';

import User from '../models/user.model.ts';
import { Roles } from '../types/types.ts';

export const registerValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .custom(async (reqEmail) => {
      const userExists = await User.exists( {email: reqEmail });
      if (userExists) {
        throw new Error(`User with email ${reqEmail} already exists`)
      }
    }),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  // Check if confirmPassword is the same as the request's password
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password) // custom() function receives a context object, which contains the req (request) key and so we are doing destructurring {req}. (context.req.body.password)
    .withMessage('Passwords do not match'),

  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^69\d{8}$/) // greek phone number
    .withMessage('Phone must be a valid Greek number without +30'),

  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 2, max: 20 })
    .withMessage('Username must be between 2 and 20 characters'),

  body('firstname')
    .trim()
    .notEmpty()
    .withMessage('Firstname is required')
    .isLength({ min: 2, max: 20 })
    .withMessage('First name must be between 2 and 20 characters'),

  body('lastname')
    .trim()
    .notEmpty()
    .withMessage('Lastname is required')
    .isLength({ min: 2, max: 20 })
    .withMessage('Last name must be between 2 and 20 characters'),

  body('role')
    .trim()
    .toLowerCase()
    .optional()
    .isIn(Object.values(Roles)) // Object.values(Roles) === ['admin', 'user']
    .withMessage(`Role must be one of: ${Object.values(Roles).join(', ')}`),
];


export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
];
