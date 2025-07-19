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
 * 
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
 * 
 *     UserRequest:
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
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, user]
 * 
 *     UserResponse:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - phoneNumber
 *         - role
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phoneNumber:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, user]
 * 
 *     UserUpdateRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - firstname
 *         - lastname
 *         - phoneNumber
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         phoneNumber:
 *           type: string
 * 
 *     ReservationWithUser:
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


const swaggerSpecs = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "myReserva API",
      version: "1.0.0",
      description: "API documentation for myReserva full-stack project",
    },
    servers: [
      {
        url: "http://localhost:3000/api"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    // security: [{ // sets security globally so every route will be under 'Authorization'. We want to omit login and register so we will set security on each route locally
    //   bearerAuth: []
    // }],
  },
  apis: [
    `./src/routes/*.ts`,
    `./src/routes/*.js`,
    `./src/swagger.ts`,
    `./src/swagger.js`,
  ]
});

export default swaggerSpecs