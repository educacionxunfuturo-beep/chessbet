const rawCoachApiBaseUrl = import.meta.env.VITE_COACH_API_URL?.trim() ?? '';

const normalizedCoachApiBaseUrl = rawCoachApiBaseUrl.replace(/\/+$/, '');

export function coachApiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedCoachApiBaseUrl
    ? `${normalizedCoachApiBaseUrl}${normalizedPath}`
    : normalizedPath;
}
