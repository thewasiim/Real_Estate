import { Router } from 'express';
import { z } from 'zod';
import { favoriteController } from '../controllers/favorite.controller.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

const addFavoriteSchema = z.object({
  propertyId: z.string().uuid('Invalid property ID'),
});

// All favorite routes require authentication per trd.md §5.7
router.get('/',               verifyToken, favoriteController.getAll);
router.post('/',              verifyToken, validate(addFavoriteSchema), favoriteController.add);
router.delete('/:propertyId', verifyToken, favoriteController.remove);

export default router;
