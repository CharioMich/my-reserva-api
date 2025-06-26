import { Router } from "express";
const router = Router();

import authRoutes from './auth.routes.ts' // (exported) router imported as authRoutes (alias)

// index route. Test route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'true',
    timestamp: new Date().toISOString
  })
});

router.use('/auth', authRoutes);

export default router;