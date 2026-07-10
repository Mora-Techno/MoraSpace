import nodemailer, { type Transporter } from 'nodemailer';
import { env } from '@/config/env.config';

type SendMailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

let cachedTransport: Transporter | null = null;

function normalizeSmtpPassword(password: string) {
  return password
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/\s/g, '');
}

function isGmailHost(host: string) {
  return host.toLowerCase().includes('gmail.com');
}

export function createMailTransport() {
  const user = env.SMTP_USER.trim();
  const pass = normalizeSmtpPassword(env.SMTP_PASS);

  if (isGmailHost(env.SMTP_HOST)) {
    if (env.SMTP_PORT === 465) {
      return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user, pass },
        tls: {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: true,
        },
      });
    }

    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user, pass },
      tls: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
      },
    });
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: { user, pass },
  });
}

function getTransport() {
  if (!cachedTransport) {
    cachedTransport = createMailTransport();
  }

  return cachedTransport;
}

export function resetMailTransport() {
  cachedTransport = null;
}

export function getMailFromAddress(label = 'Etno Learning') {
  return `"${label}" <${env.SMTP_USER.trim()}>`;
}

export async function verifyMailTransport() {
  const transporter = getTransport();
  await transporter.verify();
}

function formatMailError(error: unknown) {
  if (!(error instanceof Error)) {
    return 'Gagal mengirim email';
  }

  const smtpError = error as Error & { code?: string; responseCode?: number };

  if (smtpError.code === 'EAUTH' || smtpError.responseCode === 535) {
    return 'Autentikasi SMTP gagal. Pastikan SMTP_USER dan App Password Gmail benar.';
  }

  if (smtpError.code === 'ESOCKET' || smtpError.code === 'ECONNECTION') {
    return 'Koneksi SMTP gagal. Periksa SMTP_HOST, SMTP_PORT, dan SMTP_SECURE.';
  }

  return smtpError.message || 'Gagal mengirim email';
}

export async function sendMailMessage(input: SendMailInput) {
  const transporter = getTransport();

  try {
    const info = await transporter.sendMail({
      from: getMailFromAddress(),
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });

    return info;
  } catch (error) {
    resetMailTransport();
    throw new Error(formatMailError(error));
  }
}
