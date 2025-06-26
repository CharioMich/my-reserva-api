import { Router } from "express";

import { register } from "../controllers/auth.controller.ts";
import { registerValidator } from "../validators/auth.validator.ts";
import validateRequest from "../middlewares/validateRequest.ts"

const router = Router();

router.post('/register', registerValidator, validateRequest, register);

export default router;