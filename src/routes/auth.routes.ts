import { Router } from "express";
const router = Router();

import register from "../controllers/auth.controller.ts";

router.post('/register', register);

export default router;