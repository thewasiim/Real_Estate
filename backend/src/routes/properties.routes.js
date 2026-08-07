import { Router } from 'express';
import { z } from 'zod';
import { propertyController } from '../controllers/property.controller.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

const propertySchema = z.object({
  slug:         z.string().min(1),
  title:        z.string().min(1),
  type:         z.string().min(1),
  listingType:  z.enum(['BUY', 'RENT']),
  status:       z.string().min(1),
  price:        z.number().int().positive(),
  city:         z.string().min(1),
  locality:     z.string().min(1),
  address:      z.string().min(1),
  area:         z.number().int().positive(),
  bhk:          z.number().int().min(1),
  bathrooms:    z.number().int().min(1),
  parking:      z.number().int().min(0),
  furnishing:   z.string().min(1),
  amenities:    z.array(z.string()).default([]),
  images:       z.array(z.string()).default([]),
  floorPlans:   z.array(z.string()).default([]),
  description:  z.string().min(1),
  nearbySchools:   z.array(z.string()).default([]),
  nearbyHospitals: z.array(z.string()).default([]),
  nearbyMetro:     z.array(z.string()).default([]),
  lat:          z.number().optional(),
  lng:          z.number().optional(),
  isFeatured:   z.boolean().default(false),
  agentId:      z.string().optional(),
  videoTourUrl: z.string().optional(),
  tourUrl360:   z.string().optional(),
}).strict();

// Public
router.get('/',    propertyController.getAll);
router.get('/:id', propertyController.getById);

// Admin only
router.post('/',    verifyToken, requireRole('ADMIN'), validate(propertySchema),              propertyController.create);
router.put('/:id',  verifyToken, requireRole('ADMIN'), validate(propertySchema.partial()),   propertyController.update);
router.delete('/:id', verifyToken, requireRole('ADMIN'), propertyController.remove);

export default router;
