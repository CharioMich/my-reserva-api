import { Router } from "express";

import { register, login } from "../controllers/auth.controllers.ts";
import { registerValidator, loginValidator } from "../validators/auth.validator.ts";
import validateRequest from "../middlewares/validateRequest.ts"

const router = Router();

router.post('/register', registerValidator, validateRequest, register);

router.post('/login', loginValidator, validateRequest, login);


export default router;