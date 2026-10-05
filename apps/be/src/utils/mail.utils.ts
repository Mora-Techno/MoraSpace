import { Resend } from 'resend';
import { env } from '@/config/env.config';
import { logger } from '@/utils/logger.utils';

type SendMailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

const resendApiKey = env.RESEND_API_KEY ?? '';
const isConfigured = resendApiKey !== '' && !resendApiKey.startsWith('xxxx');

const resend = isConfigured ? new Resend(resendApiKey) : null;
const FROM_EMAIL = env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

export function getMailFromAddress(label = 'Mora') {
  return `"${label}" <${FROM_EMAIL}>`;
}

// Resend tak punya verify koneksi ala SMTP — cukup pastikan key ada.
// serve.ts sudah menangkap throw ini sebagai warning.
export async function verifyMailTransport() {
  if (!isConfigured || !resend) {
    throw new Error('RESEND_API_KEY belum dikonfigurasi');
  }
}

export async function sendMailMessage(input: SendMailInput) {
  if (!isConfigured || !resend) {
    logger.info(
      { to: input.to, subject: input.subject },
      '[EMAIL][DEV MODE - RESEND NOT CONFIGURED]',
    );
    return { id: 'dev-mode' };
  }

  const { data, error } = await resend.emails.send({
    from: getMailFromAddress(),
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html || input.text || '<p></p>',
  });

  if (error) {
    throw new Error(`[EMAIL][RESEND] Gagal mengirim email: ${error.message}`);
  }

  logger.info({ id: data?.id, to: input.to }, '[EMAIL][RESEND] Email sent successfully');
  return data;
}
