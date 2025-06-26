import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      status: false,
      code: 'validationError',
      errors: errors.mapped(), // converts the array of validation errors into an object { email: { msg: "Invalid email", ... } }
    });
    return;
  }

  next();
};

export default validateRequest;