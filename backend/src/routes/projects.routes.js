import { Router } from 'express';
import { z } from 'zod';
import { projectController } from '../controllers/project.controller.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

const projectSchema = z.object({
  slug:           z.string().min(1),
  name:           z.string().min(1),
  builder:        z.string().min(1),
  startingPrice:  z.number().int().positive(),
  possessionDate: z.string().datetime(),
  city:           z.string().min(1),
  locality:       z.string().min(1),
  images:         z.array(z.string()).default([]),
  description:    z.string().min(1),
  amenities:      z.array(z.string()).default([]),
  unitTypes:      z.array(z.string()).default([]),
  statusStage:    z.string().min(1),
});

router.get('/',    projectController.getAll);
router.get('/:id', projectController.getById);

router.post('/',     verifyToken, requireRole('ADMIN'), validate(projectSchema),            projectController.create);
router.put('/:id',   verifyToken, requireRole('ADMIN'), validate(projectSchema.partial()),  projectController.update);
router.delete('/:id',verifyToken, requireRole('ADMIN'), projectController.remove);

export default router;
