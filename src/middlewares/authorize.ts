import User from "../models/user.model.ts";

// Types
import { Response, NextFunction } from "express";

// Custom types
import { RequestWithUser } from "../types/types.ts";
import { Role } from "../types/types.ts";


const authorize = (roles: Role[]) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userId = req.userId;
    try {
      const user = await User.findById(userId, { role: 1});

      if (!user) {
        res.status(404).json({
          code: 'NotFound',
          message: 'User not found'
        });
        return;
      }

      if (!roles.includes(user.role)) {
        res.status(403).json({
          code: 'AuthorizationError',
          message: 'Access denied, insufficient permissions'
        });
        return;
      }
      return next();
    } catch (err) {
      res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        error: err
      });

      console.log('Error in user authorization. Error: ', err);
    }
  }
}

export default authorize;