import { Router } from 'express';
import { z } from 'zod';
import { testimonialController } from '../controllers/testimonial.controller.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

const testimonialSchema = z.object({
  name:     z.string().min(1),
  photoUrl: z.string().url(),
  rating:   z.number().int().min(1).max(5),
  review:   z.string().min(1),
});

router.get('/',    testimonialController.getAll);
router.get('/:id', testimonialController.getById);

router.post('/',     verifyToken, requireRole('ADMIN'), validate(testimonialSchema),            testimonialController.create);
router.put('/:id',   verifyToken, requireRole('ADMIN'), validate(testimonialSchema.partial()),  testimonialController.update);
router.delete('/:id',verifyToken, requireRole('ADMIN'), testimonialController.remove);

export default router;
