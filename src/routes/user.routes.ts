import { Router } from 'express';
import { param } from 'express-validator';

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


/**
 * @swagger
 * /users/current:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.get('/current', authenticate, authorize([Roles.Admin, Roles.User]), getCurrentUser);


/**
 * @swagger
 * /users/current:
 *   put:
 *     summary: Update current logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Fields to update (e.g., name, email, etc.)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User Not Found
 *       500:
 *         description: Internal server error
 */
router.put('/current', authenticate, authorize([Roles.Admin, Roles.User]), updateCurrentUser);  // TODO: Add Validation In Fields To Update

/**
 * @swagger
 * /users/current:
 *   delete:
 *     summary: Delete current logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User Not Found
 *       500:
 *         description: Internal server error
 */
router.delete('/current', authenticate, authorize([Roles.Admin, Roles.User]), deleteCurrentUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *       
 */
router.get('/', authenticate, authorize([Roles.Admin]), getAllUsers);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get a user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The user ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation Error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:userId', 
  authenticate, 
  authorize([Roles.Admin]), 
  param('userId').notEmpty().isMongoId().withMessage('Invalid user ID'), // Validate request parameter 'userId'
  validateRequest, 
  getUserById
);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete a user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The user ID (MongoDB ObjectId)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Validation Error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/:userId', 
  authenticate, 
  authorize([Roles.Admin]), 
  param('userId').notEmpty().isMongoId().withMessage('Invalid user ID'), // Validate request parameter 'userId'
  validateRequest, 
  deleteUserById
);


export default router;