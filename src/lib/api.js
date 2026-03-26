const DEV_FALLBACK_API_BASE_URL = 'http://localhost:5001/api';

function normalizeApiBaseUrl(value) {
  if (typeof value !== 'string') {
    return '';
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return '';
  }

  return trimmedValue.replace(/\/+$/, '');
}

const configuredApiBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

// This client is deployed separately from the backend, so production should use
// an explicit environment variable instead of assuming a same-origin /api route.
export const apiBaseUrl =
  configuredApiBaseUrl || (import.meta.env.DEV ? DEV_FALLBACK_API_BASE_URL : '');

export const isApiConfigured = Boolean(apiBaseUrl);

export const apiSetupMessage = isApiConfigured
  ? ''
  : 'AI generation is not configured yet. Add VITE_API_BASE_URL in Vercel and point it to your Render backend API, for example https://your-backend.onrender.com/api.';

export function buildApiUrl(path) {
  if (!isApiConfigured) {
    throw new Error(apiSetupMessage);
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${apiBaseUrl}${normalizedPath}`;
}
