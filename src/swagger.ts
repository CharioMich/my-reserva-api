import swaggerJSDoc from "swagger-jsdoc";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - firstname
 *         - lastname
 *         - phoneNumber
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *           readOnly: true
 *         username:
 *           type: string
 *           maxLength: 20
 *           description: Unique username (lowercase, trimmed)
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 50
 *           description: Unique user email
 *         password:
 *           type: string
 *           minLength: 8
 *           maxLength: 20
 *           writeOnly: true
 *           description: User's password (hashed in DB)
 *         firstname:
 *           type: string
 *           minLength: 2
 *           maxLength: 20
 *         lastname:
 *           type: string
 *           minLength: 2
 *           maxLength: 20
 *         phoneNumber:
 *           type: string
 *           pattern: "^69\\d{8}$"
 *           description: Greek mobile phone number
 *         role:
 *           type: string
 *           enum: [admin, user]
 *           default: user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
*
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - date
 *         - hours
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *           readOnly: true
 *         date:
 *           type: string
 *           format: date
 *           description: Reservation date (YYYY-MM-DD)
 *         hours:
 *           type: string
 *           pattern: "^\\d{2}:(00|30)$"
 *           description: Time in HH:MM format (only :00 or :30 allowed)
 *         text:
 *           type: string
 *           maxLength: 200
 *           description: Optional message for the reservation
 *         userId:
 *           type: string
 *           description: MongoDB ObjectId referencing a User
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: object
 *       required:
 *         - token
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *           readOnly: true
 *         token:
 *           type: string
 *           description: The authentication or refresh token
 *         userId:
 *           type: string
 *           description: MongoDB ObjectId of the associated user
 */


const swaggerSpecs = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "myReserva API",
      version: "1.0.0",
      description: "CRUD API for myReserva full-stack project",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{
      bearerAuth: []
    }],
  },
  apis: [
    `./src/routes/*.ts`,
    `./src/routes/*.js`,
    `./src/swagger.ts`,
    `./src/swagger.js`,
  ]
});

export default swaggerSpecs