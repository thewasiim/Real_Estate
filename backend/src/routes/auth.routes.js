import { Router } from 'express';
import { z } from 'zod';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();
const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters').regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  email: z.string().trim().email('Invalid email address').max(100, 'Email cannot exceed 100 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters long').max(100, 'Password cannot exceed 100 characters'),
  phone: z.string().trim().optional().refine((val) => !val || /^[6-9]\d{9}$/.test(val.replace(/^(\+91|0)/, '').replace(/\s+/g, '')), 'Phone number must be a valid 10-digit Indian mobile number'),
});
const loginSchema = z.object({ email: z.string().trim().email('Invalid email address'), password: z.string().min(1, 'Password is required') });
const forgotPasswordSchema = z.object({ email: z.string().trim().email('Invalid email address').max(100, 'Email cannot exceed 100 characters') });
const resetPasswordSchema = z.object({
  token: z.string().regex(/^[a-f0-9]{64}$/i, 'Invalid password reset token'),
  password: z.string().min(6, 'Password must be at least 6 characters long').max(100, 'Password cannot exceed 100 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.requestPasswordReset);
router.get('/reset-password/:token', authController.verifyPasswordResetToken);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.post('/logout', authController.logout);
router.get('/me', verifyToken, authController.me);
export default router;
