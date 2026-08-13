import crypto from 'crypto';
import prisma from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/hashPassword.js';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function resetTokenError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

export const authService = {
  async registerUser({ name, email, password, phone }) {
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) throw new Error('Email is already registered');

    const passwordHash = await hashPassword(password);
    return prisma.user.create({
      data: { name, email: email.toLowerCase(), passwordHash, phone, role: 'USER' },
      select: { id: true, name: true, email: true, phone: true, avatarUrl: true, role: true, createdAt: true },
    });
  },

  async loginUser({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      throw new Error('Invalid email or password');
    }
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async getUserById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, phone: true, avatarUrl: true, role: true, createdAt: true },
    });
  },

  // Stores only a SHA-256 token digest; previously active reset links are consumed.
  async createPasswordResetToken(email) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, name: true, email: true },
    });
    if (!user) return null;

    const token = crypto.randomBytes(32).toString('hex');
    const now = new Date();
    await prisma.$transaction([
      prisma.passwordResetToken.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: now } }),
      prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash: hashResetToken(token), expiresAt: new Date(now.getTime() + RESET_TOKEN_TTL_MS) } }),
    ]);
    return { user, token };
  },

  async isPasswordResetTokenValid(token) {
    if (!token || typeof token !== 'string') return false;
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashResetToken(token) },
      select: { expiresAt: true, usedAt: true },
    });
    return Boolean(resetToken && !resetToken.usedAt && resetToken.expiresAt > new Date());
  },

  async resetPassword({ token, password }) {
    if (!token || typeof token !== 'string') throw resetTokenError('This password reset link is invalid or has expired.');

    const tokenHash = hashResetToken(token);
    const now = new Date();
    await prisma.$transaction(async (tx) => {
      const resetToken = await tx.passwordResetToken.findUnique({
        where: { tokenHash },
        select: { id: true, userId: true, expiresAt: true, usedAt: true },
      });
      if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= now) {
        throw resetTokenError('This password reset link is invalid, expired, or has already been used.');
      }
      const consumed = await tx.passwordResetToken.updateMany({
        where: { id: resetToken.id, usedAt: null, expiresAt: { gt: now } },
        data: { usedAt: now },
      });
      if (consumed.count !== 1) throw resetTokenError('This password reset link is invalid, expired, or has already been used.');
      await tx.user.update({ where: { id: resetToken.userId }, data: { passwordHash: await hashPassword(password) } });
    });
  },
};
