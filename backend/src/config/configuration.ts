const readEnv = (value?: string) => value?.trim() ?? '';

export default () => ({
  port: readEnv(process.env.PORT) ? parseInt(readEnv(process.env.PORT), 10) : 3001,
  environment: readEnv(process.env.NODE_ENV) || 'development',
  frontendUrl: readEnv(process.env.FRONTEND_URL) || 'http://localhost:5173',

  // SQL Server (mssql)
  database: {
    host: readEnv(process.env.DB_HOST),
    port: readEnv(process.env.DB_PORT) ? parseInt(readEnv(process.env.DB_PORT), 10) : 1433,
    user: readEnv(process.env.DB_USER),
    password: readEnv(process.env.DB_PASSWORD),
    name: readEnv(process.env.DB_NAME),
    encrypt: readEnv(process.env.DB_ENCRYPT) === 'true',
    trustServerCertificate: readEnv(process.env.DB_TRUST_SERVER_CERT) !== 'false',
  },

  jwt: {
    secret: readEnv(process.env.JWT_SECRET),
    expiresIn: readEnv(process.env.JWT_EXPIRES_IN) || '15m',
  },

  mail: {
    user: readEnv(process.env.EMAIL_USER),
    password: readEnv(process.env.EMAIL_PASS),
  },

  // Custom in-memory captcha
  captcha: {
    ttlMinutes: process.env.CAPTCHA_TTL_MINUTES
      ? parseInt(process.env.CAPTCHA_TTL_MINUTES, 10)
      : 5,
  },
});
