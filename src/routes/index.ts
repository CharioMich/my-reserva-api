import { Router } from "express";
const router = Router();

import authRoutes from './auth.routes.ts'; // (exported) router imported as authRoutes (alias)
import userRoutes from './user.routes.ts';
import reservationRoutes from './reservation.routes.ts';


// index route. Test route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'true',
    timestamp: new Date().toISOString
  })
});

// Register & Login
router.use('/auth', authRoutes);

// User routes
router.use('/users', userRoutes);

// Reservations routes
router.use('/reservations', reservationRoutes);

export default router;