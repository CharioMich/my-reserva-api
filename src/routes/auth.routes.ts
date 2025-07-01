import { Router } from "express";
import { cookie } from "express-validator";

import { register, login, logout } from "../controllers/auth-controllers.ts";
import { registerValidator, loginValidator } from "../validators/auth-validator.ts";
import validateRequest from "../middlewares/validate-request.ts"
import refreshToken from "../controllers/refresh-token-controller.ts";
import authenticate from "../middlewares/authenticate.ts";

const router = Router();

router.post('/register', registerValidator, validateRequest, register);

router.post('/login', loginValidator, validateRequest, login);

router.post(
  '/refresh-token', 
  cookie('refreshToken')
  .notEmpty()
  .withMessage('Refresh token required')
  .isJWT()
  .withMessage('Invalid refresh token'), 
  validateRequest,
  refreshToken);

  router.post('/logout', authenticate, logout);

export default router;