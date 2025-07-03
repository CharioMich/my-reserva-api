import { Router } from 'express';
import { param, query, body } from 'express-validator';

// Controllers
import { 
  getCurrentUser, 
  updateCurrentUser, 
  deleteCurrentUser, 
  getAllUsers, 
  getUserById, 
  deleteUserById 
} from '../controllers/user-controllers.ts';

// Types
import { Roles } from '../types/types.ts';

// Middlewares
import authenticate from '../middlewares/authenticate.ts';
import validateRequest from '../middlewares/validate-request.ts';
import authorize from '../middlewares/authorize.ts';


const router = Router();

router.get('/current', authenticate, authorize([Roles.Admin, Roles.User]), getCurrentUser);

router.put('/current', authenticate, authorize([Roles.Admin, Roles.User]), updateCurrentUser);  // TODO: Add Validation In Fields To Update

router.delete('/current', authenticate, authorize([Roles.Admin, Roles.User]), deleteCurrentUser);

router.get('/', authenticate, authorize([Roles.Admin]), getAllUsers);

router.get(
  '/:userId', 
  authenticate, 
  authorize([Roles.Admin]), 
  param('userId').notEmpty().isMongoId().withMessage('Invalid user ID'), // Validate request parameter 'userId'
  validateRequest, 
  getUserById
);

router.delete(
  '/:userId', 
  authenticate, 
  authorize([Roles.Admin]), 
  param('userId').notEmpty().isMongoId().withMessage('Invalid user ID'), // Validate request parameter 'userId'
  validateRequest, 
  deleteUserById
);


export default router;