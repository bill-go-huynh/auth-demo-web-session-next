export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  googleSessionUrl:
    process.env.NEXT_PUBLIC_GOOGLE_SESSION_URL ||
    'http://localhost:8080/auth/google/session',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Auth Demo - Session Client',
} as const;

