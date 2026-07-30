/**
 * Format standar dengan tanggal dan waktu
 * Output: "31 Juli 2026 pukul 10.13"
 */
export const formatDateTime = (isoString: string): string => {
  if (!isoString) return "-";
  const date = new Date(isoString);

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
};

/**
 * Format tanggal saja (cocok untuk tabel atau card)
 * Output: "31 Jul 2026"
 */
export const formatDateOnly = (isoString: string): string => {
  if (!isoString) return "-";
  const date = new Date(isoString);

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

/**
 * Format jam saja
 * Output: "10:13 WIB"
 */
export const formatTimeOnly = (isoString: string): string => {
  if (!isoString) return "-";
  const date = new Date(isoString);

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
};

/**
 * Format hari lengkap
 * Output: "Jumat, 31 Juli 2026"
 */
export const formatFullDay = (isoString: string): string => {
  if (!isoString) return "-";
  const date = new Date(isoString);

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};
