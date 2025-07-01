import { Router } from 'express';
import { param, query, body } from 'express-validator';

import { getCurrentUser, updateCurrentUser } from '../controllers/user-controllers.ts';

import { Roles } from '../types/types.ts';

// Middlewares
import authenticate from '../middlewares/authenticate.ts';
import validateRequest from '../middlewares/validate-request.ts';
import authorize from '../middlewares/authorize.ts';

import User from '../models/user.model.ts';

const router = Router();

router.get('/current', authenticate, authorize([Roles.Admin, Roles.User]), getCurrentUser);

router.put('/current', authenticate, authorize([Roles.Admin, Roles.User]), updateCurrentUser);

export default router;