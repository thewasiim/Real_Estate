import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { leadController } from '../controllers/lead.controller.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

// Base lead schema with type-specific conditional validation per trd.md §5.6
const baseLeadSchema = z.object({
  type:          z.enum(['SCHEDULE_VISIT', 'BOOK_SITE_VISIT', 'CONTACT', 'NEWSLETTER']),
  name:          z.string().trim().optional(),
  email:         z.string().trim().email('Invalid email address').max(100, 'Email cannot exceed 100 characters'),
  phone:         z.string().trim().optional(),
  message:       z.string().trim().max(2000, 'Message cannot exceed 2000 characters').optional(),
  propertyId:    z.string().trim().optional(),
  preferredDate: z.string().trim().optional(),
  preferredTime: z.string().trim().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'NEWSLETTER') return; // only email required

  if (!data.name || data.name.trim().length < 2) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Name must be at least 2 characters', path: ['name'] });
  } else if (!/^[a-zA-Z\s]+$/.test(data.name.trim())) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Name must contain only letters and spaces', path: ['name'] });
  }

  if (!data.phone) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Phone is required', path: ['phone'] });
  } else {
    const cleanPhone = data.phone.replace(/^(\+91|0)/, '').replace(/\s+/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Phone number must be a valid 10-digit Indian mobile number', path: ['phone'] });
    }
  }

  if (data.type === 'SCHEDULE_VISIT') {
    if (!data.propertyId)    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Property ID is required',   path: ['propertyId'] });
    if (!data.preferredDate) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Preferred date is required', path: ['preferredDate'] });
    if (!data.preferredTime) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Preferred time is required', path: ['preferredTime'] });
  }
});

const updateLeadSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'CLOSED']),
});

/**
 * Optional token middleware — attaches req.user if a valid cookie is present,
 * but does NOT block the request if the cookie is missing or invalid.
 * Used for lead submission where guests are also allowed.
 */
function optionalToken(req, res, next) {
  const token = req.cookies?.token;
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch { /* ignore — guest */ }
  }
  next();
}

// Guest + logged-in users can submit leads
router.post('/',      optionalToken, validate(baseLeadSchema), leadController.create);
// Admin only
router.get('/',       verifyToken, requireRole('ADMIN'), leadController.getAll);
router.patch('/:id',  verifyToken, requireRole('ADMIN'), validate(updateLeadSchema), leadController.updateStatus);
router.delete('/:id', verifyToken, requireRole('ADMIN'), leadController.remove);

export default router;
