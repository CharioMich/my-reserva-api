import { Router } from "express";

// Controllers
import { getAllReservations } from "../controllers/reservation-controllers.ts";

// Types
import { Roles } from '../types/types.ts';

// Middlewares
import authenticate from '../middlewares/authenticate.ts';
import validateRequest from '../middlewares/validate-request.ts';
import authorize from '../middlewares/authorize.ts';



const router = Router();

router.get('/', authenticate, authorize([Roles.Admin]), getAllReservations );


export default router;