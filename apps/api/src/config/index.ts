
export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret-key',
    expiresIn: '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
} as const
