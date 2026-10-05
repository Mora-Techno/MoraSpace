export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

/** Skor kekuatan password 0-4. Dipakai web & mobile (satu sumber). */
export function scorePassword(password: string): PasswordStrength {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^a-zA-Z0-9]/.test(password)) score += 1;
  if (score <= 1) return { score, label: 'Lemah', color: 'bg-red-500' };
  if (score === 2) return { score, label: 'Sedang', color: 'bg-amber-500' };
  if (score === 3) return { score, label: 'Kuat', color: 'bg-lime-500' };
  return { score, label: 'Sangat Kuat', color: 'bg-green-600' };
}
