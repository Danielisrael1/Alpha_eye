// Inline SVG data URI so the fallback never depends on a network request itself.
export const IMAGE_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#e2e8f0"/>
      <path d="M50 32c-16 0-28 12-33 18 5 6 17 18 33 18s28-12 33-18c-5-6-17-18-33-18z" fill="none" stroke="#94a3b8" stroke-width="4"/>
      <circle cx="50" cy="50" r="10" fill="#94a3b8"/>
    </svg>`
  );

export function onImageError(e) {
  if (e.target.src !== IMAGE_PLACEHOLDER) {
    e.target.onerror = null;
    e.target.src = IMAGE_PLACEHOLDER;
  }
}
