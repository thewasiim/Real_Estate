import { Router } from 'express';
import { z } from 'zod';
import { userController } from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

const updateRoleSchema = z.object({
  role: z.enum(['USER', 'AGENT', 'ADMIN']),
});

// Admin only per trd.md §5.3
router.get('/',           verifyToken, requireRole('ADMIN'), userController.getAll);
router.patch('/:id/role', verifyToken, requireRole('ADMIN'), validate(updateRoleSchema), userController.updateRole);

export default router;
