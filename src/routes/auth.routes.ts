import { Router } from "express";
import { cookie } from "express-validator";

import { register, login, logout } from "../controllers/auth-controllers.ts";
import { registerValidator, loginValidator } from "../validators/auth-validator.ts";
import validateRequest from "../middlewares/validate-request.ts"
import refreshToken from "../controllers/refresh-token-controller.ts";
import authenticate from "../middlewares/authenticate.ts";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/UserRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *       403:
 *         description: Unauthorized
 *       400:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
router.post('/register', registerValidator, validateRequest, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login, returns access token and user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Validation Error
 *       404:
 *         description: User Not Found
 *       500:
 *         description: Internal Server Error
 *       
 */
router.post('/login', loginValidator, validateRequest, login);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh JWT access token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Must provide refresh token in cookie
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: {}
 *     responses:
 *       200:
 *         description: New access token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post(
  '/refresh-token', 
  cookie('refreshToken')
  .notEmpty()
  .withMessage('Refresh token required')
  .isJWT()
  .withMessage('Invalid refresh token'), 
  validateRequest,
  refreshToken);


  /**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out and refresh token cleared
 *       401:
 *         description: Authentication Error
 *       500:
 *         description: Internal Server Error
 */
router.post('/logout', authenticate, logout);

export default router;