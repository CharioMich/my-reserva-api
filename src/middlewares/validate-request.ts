import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * Collects any validation errors gathered by the previous middleware, "registerValidator". If there are no errors, it calls next() and the request flow passes to the controller
 */
const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ // 400 Bad request
      status: false,
      code: 'validationError',
      errors: errors.mapped(), // converts the array of validation errors into an object { email: { msg: "Invalid email", ... } }
    });
    return;
  }

  next();
};

export default validateRequest;