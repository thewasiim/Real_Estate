import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

router.get('/stats', verifyToken, requireRole('ADMIN'), adminController.getStats);

export default router;
