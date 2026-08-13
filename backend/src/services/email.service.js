import nodemailer from 'nodemailer';

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error('SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD.');
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
}

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  if (!process.env.SMTP_FROM) throw new Error('SMTP_FROM is not configured.');
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Reset your F.B. Developer password',
    text: `Hello ${name},\n\nUse this link to reset your password: ${resetUrl}\n\nThis link expires in one hour and can only be used once. If you did not request this, you can ignore this email.`,
    html: `<p>Hello ${name},</p><p>Use the link below to reset your F.B. Developer password:</p><p><a href="${resetUrl}">Reset password</a></p><p>This link expires in one hour and can only be used once. If you did not request this, you can ignore this email.</p>`,
  });
}
