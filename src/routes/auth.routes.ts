import { Router } from "express";

import { register, login } from "../controllers/auth-controllers.ts";
import { registerValidator, loginValidator } from "../validators/auth-validator.ts";
import validateRequest from "../middlewares/validate-request.ts"

const router = Router();

router.post('/register', registerValidator, validateRequest, register);

router.post('/login', loginValidator, validateRequest, login);

router.post('/refresh-token', )

export default router;