import { Router } from 'express';
import { z } from 'zod';
import { agentController } from '../controllers/agent.controller.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

const agentSchema = z.object({
  name:            z.string().trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  photoUrl:        z.string().trim().optional(),
  phone:           z.string().trim().refine(
    (val) => /^[6-9]\d{9}$/.test(val.replace(/^(\+91|0)/, '').replace(/\s+/g, '')),
    'Phone number must be a valid 10-digit Indian mobile number'
  ),
  whatsapp:        z.string().trim().refine(
    (val) => /^[6-9]\d{9}$/.test(val.replace(/^(\+91|0)/, '').replace(/\s+/g, '')),
    'WhatsApp number must be a valid 10-digit Indian mobile number'
  ),
  email:           z.string().trim().email('Invalid email address').max(100, 'Email cannot exceed 100 characters'),
  role:            z.string().trim().min(1, 'Role is required'),
  city:            z.string().trim().min(1, 'City is required'),
  experienceYears: z.number().int().min(0, 'Experience years cannot be negative').max(70, 'Experience years cannot exceed 70'),
});

router.get('/',    agentController.getAll);
router.get('/:id', agentController.getById);

router.post('/',     verifyToken, requireRole('ADMIN'), validate(agentSchema),            agentController.create);
router.put('/:id',   verifyToken, requireRole('ADMIN'), validate(agentSchema.partial()),  agentController.update);
router.delete('/:id',verifyToken, requireRole('ADMIN'), agentController.remove);

export default router;
