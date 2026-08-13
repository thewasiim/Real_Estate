import { authService } from '../services/auth.service.js';
import { sendPasswordResetEmail } from '../services/email.service.js';
import { generateToken, setTokenCookie, clearTokenCookie } from '../utils/generateToken.js';

const RESET_REQUEST_MESSAGE = 'If an account exists for that email address, a password reset link has been sent.';

export const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password, phone } = req.body;
      const user = await authService.registerUser({ name, email, password, phone });
      setTokenCookie(res, generateToken(user.id, user.role));
      res.status(201).json({ success: true, data: { user } });
    } catch (err) { next(err); }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await authService.loginUser({ email, password });
      setTokenCookie(res, generateToken(user.id, user.role));
      res.status(200).json({ success: true, data: { user } });
    } catch (err) { next(err); }
  },

  async logout(req, res, next) {
    try { clearTokenCookie(res); res.status(200).json({ success: true }); } catch (err) { next(err); }
  },

  async me(req, res, next) {
    try {
      const user = await authService.getUserById(req.user.userId);
      if (!user) return res.status(401).json({ success: false, error: 'User not found' });
      res.status(200).json({ success: true, data: { user } });
    } catch (err) { next(err); }
  },

  async requestPasswordReset(req, res, next) {
    try {
      const result = await authService.createPasswordResetToken(req.body.email);
      if (result) {
        const frontendUrl = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
        if (!frontendUrl) {
          console.error('Password reset email was not sent: FRONTEND_URL is not configured.');
        } else {
          try {
            await sendPasswordResetEmail({ ...result.user, resetUrl: `${frontendUrl}/reset-password?token=${encodeURIComponent(result.token)}` });
          } catch (error) {
            console.error('Password reset email was not sent:', error.message);
          }
        }
      }
      res.status(200).json({ success: true, data: { message: RESET_REQUEST_MESSAGE } });
    } catch (err) { next(err); }
  },

  async verifyPasswordResetToken(req, res, next) {
    try {
      if (!(await authService.isPasswordResetTokenValid(req.params.token))) {
        return res.status(400).json({ success: false, error: 'This password reset link is invalid, expired, or has already been used.' });
      }
      res.status(200).json({ success: true });
    } catch (err) { next(err); }
  },

  async resetPassword(req, res, next) {
    try {
      await authService.resetPassword(req.body);
      res.status(200).json({ success: true, data: { message: 'Password reset successfully. You can now log in.' } });
    } catch (err) { next(err); }
  },
};
