export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  environment: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // SQL Server (mssql)
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERT !== 'false',
  },


  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  },


  mail: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
  },

  // Custom in-memory captcha
  captcha: {
    ttlMinutes: process.env.CAPTCHA_TTL_MINUTES ? parseInt(process.env.CAPTCHA_TTL_MINUTES, 10) : 5,
  },
});