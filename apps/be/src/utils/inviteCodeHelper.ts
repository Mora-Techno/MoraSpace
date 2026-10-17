import crypto from 'node:crypto';

// Unambiguous characters (avoiding 0, O, 1, I, L)
const INVITE_CHARS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

export function generateInviteCode(length = 8): string {
  let result = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += INVITE_CHARS[bytes[i] % INVITE_CHARS.length];
  }
  return result;
}
