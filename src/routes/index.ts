import { Router } from "express";
const router = Router();

import authRoutes from './auth.routes.ts'; // (exported) router imported as authRoutes (alias)
import userRoutes from './user.routes.ts';
import reservationRoutes from './reservation.routes.ts';
import swaggerUi from "swagger-ui-express"
import swaggerJSDoc from "swagger-jsdoc";
import swaggerSpecs from "../swagger.ts";


// index route. Test route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'true',
    timestamp: new Date().toISOString
  })
});


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and session management
 */
router.use('/auth', authRoutes);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: CRUD API for Users
 */
router.use('/users', userRoutes);

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Reservations management
 */
router.use('/reservations', reservationRoutes);

// API Documentation
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

export default router;