/**
 * Extract the YouTube video ID from various URL formats.
 *
 * Supported formats:
 *  - https://www.youtube.com/watch?v=VIDEO_ID
 *  - https://youtu.be/VIDEO_ID
 *  - https://www.youtube.com/embed/VIDEO_ID
 *  - https://www.youtube.com/v/VIDEO_ID
 *  - https://www.youtube.com/shorts/VIDEO_ID
 *  - https://m.youtube.com/watch?v=VIDEO_ID
 *  - Raw 11-char video ID
 *
 * Returns `null` when the input cannot be parsed.
 */
export function extractYouTubeVideoId(input: string): string | null {
  if (!input || typeof input !== "string") return null;

  const trimmed = input.trim();

  // Already a raw 11-character video ID
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  // youtu.be short-link
  if (
    url.hostname === "youtu.be" ||
    url.hostname === "www.youtu.be" ||
    url.hostname === "m.youtu.be"
  ) {
    const id = url.pathname.slice(1).split("/")[0];
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  }

  // youtube.com variants
  const host = url.hostname.replace("m.", "");
  if (host !== "youtube.com" && host !== "www.youtube.com") {
    return null;
  }

  // /watch?v=...
  const v = url.searchParams.get("v");
  if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) {
    return v;
  }

  // /embed/, /v/, /shorts/
  const pathMatch = url.pathname.match(
    /^\/(embed|v|shorts)\/([A-Za-z0-9_-]{11})/,
  );
  if (pathMatch) {
    return pathMatch[2];
  }

  return null;
}
