import { Router } from 'express';
import { z } from 'zod';
import { agentController } from '../controllers/agent.controller.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

const agentSchema = z.object({
  name:            z.string().min(1),
  photoUrl:        z.string().url(),
  phone:           z.string().min(1),
  whatsapp:        z.string().min(1),
  email:           z.string().email(),
  role:            z.string().min(1),
  city:            z.string().min(1),
  experienceYears: z.number().int().min(0),
});

router.get('/',    agentController.getAll);
router.get('/:id', agentController.getById);

router.post('/',     verifyToken, requireRole('ADMIN'), validate(agentSchema),            agentController.create);
router.put('/:id',   verifyToken, requireRole('ADMIN'), validate(agentSchema.partial()),  agentController.update);
router.delete('/:id',verifyToken, requireRole('ADMIN'), agentController.remove);

export default router;
