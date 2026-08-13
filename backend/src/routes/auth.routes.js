import { Router } from 'express';
import { z } from 'zod';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// Zod schemas for request validation
const registerSchema = z.object({
  name: z.string().trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  email: z.string().trim().email('Invalid email address').max(100, 'Email cannot exceed 100 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters long').max(100, 'Password cannot exceed 100 characters'),
  phone: z.string().trim().optional().refine(
    (val) => !val || /^[6-9]\d{9}$/.test(val.replace(/^(\+91|0)/, '').replace(/\s+/g, '')),
    'Phone number must be a valid 10-digit Indian mobile number'
  ),
});

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', verifyToken, authController.me);

export default router;
// 
