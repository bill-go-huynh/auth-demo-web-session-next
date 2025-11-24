const port = process.env.PORT || '3000';

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  googleSessionUrl: `${
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
  }/auth/session/google`,
  frontendBaseUrl: `http://localhost:${port}`,
  oauthCallbackUrl: `http://localhost:${port}/oauth/callback`,
} as const;
