import { Router } from 'express';
import { z } from 'zod';
import { propertyController } from '../controllers/property.controller.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

const propertySchema = z.object({
  slug:         z.string().trim().min(1).max(200),
  title:        z.string().trim().min(2, 'Title must be at least 2 characters').max(150, 'Title cannot exceed 150 characters'),
  type:         z.string().trim().min(1),
  listingType:  z.enum(['BUY', 'RENT']),
  status:       z.string().trim().min(1),
  price:        z.number().positive('Price must be greater than 0'),
  city:         z.string().trim().min(1),
  locality:     z.string().trim().min(1),
  address:      z.string().trim().min(1),
  area:         z.number().positive('Area must be greater than 0'),
  bhk:          z.number().int().min(1, 'BHK must be at least 1'),
  bathrooms:    z.number().int().min(1, 'Bathrooms must be at least 1'),
  parking:      z.number().int().min(0, 'Parking slots cannot be negative'),
  furnishing:   z.string().trim().min(1),
  amenities:    z.array(z.string()).default([]),
  images:       z.array(z.string()).default([]),
  floorPlans:   z.array(z.string()).default([]),
  description:  z.string().trim().min(1, 'Description is required').max(5000, 'Description cannot exceed 5000 characters'),
  nearbySchools:   z.array(z.string()).default([]),
  nearbyHospitals: z.array(z.string()).default([]),
  nearbyMetro:     z.array(z.string()).default([]),
  lat:          z.number().optional(),
  lng:          z.number().optional(),
  isFeatured:   z.boolean().default(false),
  agentId:      z.string().optional(),
  videoTourUrl: z.string().optional(),
  tourUrl360:   z.string().optional(),
});

// Public
router.get('/',    propertyController.getAll);
router.get('/:id', propertyController.getById);

// Admin only
router.post('/',    verifyToken, requireRole('ADMIN'), validate(propertySchema),              propertyController.create);
router.put('/:id',  verifyToken, requireRole('ADMIN'), validate(propertySchema.partial()),   propertyController.update);
router.delete('/:id', verifyToken, requireRole('ADMIN'), propertyController.remove);

export default router;
