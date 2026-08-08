import { Router } from 'express';
import { z } from 'zod';
import { faqController } from '../controllers/faq.controller.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

const faqSchema = z.object({
  question: z.string().min(1),
  answer:   z.string().min(1),
});

router.get('/',    faqController.getAll);
router.get('/:id', faqController.getById);

router.post('/',     verifyToken, requireRole('ADMIN'), validate(faqSchema),            faqController.create);
router.put('/:id',   verifyToken, requireRole('ADMIN'), validate(faqSchema.partial()),  faqController.update);
router.delete('/:id',verifyToken, requireRole('ADMIN'), faqController.remove);

export default router;
