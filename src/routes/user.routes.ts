import { Router } from 'express';
import { param, query, body } from 'express-validator';

import { getCurrentUser, updateCurrentUser, deleteCurrentUser } from '../controllers/user-controllers.ts';

import { Roles } from '../types/types.ts';

// Middlewares
import authenticate from '../middlewares/authenticate.ts';
import validateRequest from '../middlewares/validate-request.ts';
import authorize from '../middlewares/authorize.ts';
import { registerValidator } from '../validators/auth-validator.ts';

import User from '../models/user.model.ts';

const router = Router();

router.get('/current', authenticate, authorize([Roles.Admin, Roles.User]), getCurrentUser);

router.put('/current', authenticate, authorize([Roles.Admin, Roles.User]), updateCurrentUser);  // TODO: Add Validation In Fields To Update

router.delete('/current', authenticate, authorize([Roles.Admin, Roles.User]), deleteCurrentUser)

export default router;