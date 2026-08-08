import { Router } from 'express';
import { z } from 'zod';
import { blogController } from '../controllers/blog.controller.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

const blogSchema = z.object({
  title:    z.string().min(1),
  slug:     z.string().optional(),
  coverUrl: z.string().url(),
  excerpt:  z.string().min(1),
  content:  z.string().min(1),
  author:   z.string().min(1),
});

router.get('/',    blogController.getAll);
router.get('/:id', blogController.getById);

router.post('/',     verifyToken, requireRole('ADMIN'), validate(blogSchema),            blogController.create);
router.put('/:id',   verifyToken, requireRole('ADMIN'), validate(blogSchema.partial()),  blogController.update);
router.delete('/:id',verifyToken, requireRole('ADMIN'), blogController.remove);

export default router;
