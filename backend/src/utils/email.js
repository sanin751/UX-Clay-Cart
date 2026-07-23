const nodemailer = require('nodemailer');
const logger = require('./logger');
const env = require('../config/env');

// Real delivery goes through Resend's SMTP relay (just an API key, never the
// user's actual mailbox password). Without a key configured we fall back to
// a free, auto-provisioned Ethereal test inbox so the flow is still fully
// testable end-to-end.
let transporterPromise = null;

async function getTransporter() {
  if (!transporterPromise) {
    if (env.resend.apiKey) {
      transporterPromise = Promise.resolve(
        nodemailer.createTransport({
          host: 'smtp.resend.com',
          port: 465,
          secure: true,
          auth: { user: 'resend', pass: env.resend.apiKey },
        })
      );
    } else {
      transporterPromise = nodemailer.createTestAccount().then((testAccount) =>
        nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: { user: testAccount.user, pass: testAccount.pass },
        })
      );
    }
  }
  return transporterPromise;
}

async function sendPasswordResetEmail(to, resetUrl) {
  if (process.env.NODE_ENV === 'test') {
    logger.info(`[email:test] Password reset link for ${to}: ${resetUrl}`);
    return { previewUrl: null };
  }

  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: env.resend.fromEmail,
    to,
    subject: 'Reset your ClayCart password',
    text: `We received a request to reset your ClayCart password.\n\nReset it here: ${resetUrl}\n\nThis link expires in 10 minutes. If you didn't request this, you can safely ignore this email.`,
    html: `<p>We received a request to reset your ClayCart password.</p><p><a href="${resetUrl}">Click here to reset your password</a></p><p>This link expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>`,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info) || null;
  logger.info(`[email] Password reset email sent to ${to}${previewUrl ? `. Preview: ${previewUrl}` : ''}`);
  return { previewUrl };
}

module.exports = { sendPasswordResetEmail };
