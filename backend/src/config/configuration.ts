const readEnv = (value?: string) => value?.trim() ?? '';

export default () => ({
  port: readEnv(process.env.PORT) ? parseInt(readEnv(process.env.PORT), 10) : 3001,
  environment: readEnv(process.env.NODE_ENV) || 'development',
  // One URL, or several separated by commas (the allowed CORS origins).
  frontendUrl: readEnv(process.env.FRONTEND_URL) || 'http://localhost:5173',

  // Swagger UI: always on outside production; in production only when true.
  swaggerEnabled: readEnv(process.env.SWAGGER_ENABLED) === 'true',

  // Number of reverse proxies in front of the app (0 = none).
  trustProxy: readEnv(process.env.TRUST_PROXY)
    ? parseInt(readEnv(process.env.TRUST_PROXY), 10)
    : 0,

  // SQL Server (mssql)
  database: {
    host: readEnv(process.env.DB_HOST),
    port: readEnv(process.env.DB_PORT) ? parseInt(readEnv(process.env.DB_PORT), 10) : 1433,
    user: readEnv(process.env.DB_USER),
    password: readEnv(process.env.DB_PASSWORD),
    name: readEnv(process.env.DB_NAME),
    encrypt: readEnv(process.env.DB_ENCRYPT) === 'true',
    trustServerCertificate: readEnv(process.env.DB_TRUST_SERVER_CERT) !== 'false',
    // Connection pool and timeouts. The defaults are the driver's own.
    poolMax: readEnv(process.env.DB_POOL_MAX) ? parseInt(readEnv(process.env.DB_POOL_MAX), 10) : 10,
    poolMin: readEnv(process.env.DB_POOL_MIN) ? parseInt(readEnv(process.env.DB_POOL_MIN), 10) : 0,
    connectionTimeoutMs: readEnv(process.env.DB_CONNECTION_TIMEOUT_MS)
      ? parseInt(readEnv(process.env.DB_CONNECTION_TIMEOUT_MS), 10)
      : 15000,
    requestTimeoutMs: readEnv(process.env.DB_REQUEST_TIMEOUT_MS)
      ? parseInt(readEnv(process.env.DB_REQUEST_TIMEOUT_MS), 10)
      : 15000,
  },

  jwt: {
    secret: readEnv(process.env.JWT_SECRET),
    // Not used any more: the access-token lifetime is auth.accessTtl below.
    expiresIn: readEnv(process.env.JWT_EXPIRES_IN) || '15m',
  },

  // Login sessions (Phase 1B)
  auth: {
    // Lifetime of the access token. Bare number = seconds, or 30s / 15m / 24h / 7d.
    // Short on purpose: the browser renews it quietly through /auth/refresh.
    accessTtl: readEnv(process.env.ACCESS_TOKEN_TTL) || '15m',
    // A login ends after this long without a refresh...
    sessionIdleMinutes: readEnv(process.env.SESSION_IDLE_MINUTES)
      ? parseInt(readEnv(process.env.SESSION_IDLE_MINUTES), 10)
      : 60,
    // ...and never lasts longer than this, however active the user is.
    sessionAbsoluteMinutes: readEnv(process.env.SESSION_ABSOLUTE_MINUTES)
      ? parseInt(readEnv(process.env.SESSION_ABSOLUTE_MINUTES), 10)
      : 1440,
    // Cookie "Secure" flag: needs HTTPS. Defaults to on in production.
    cookieSecure: readEnv(process.env.COOKIE_SECURE)
      ? readEnv(process.env.COOKIE_SECURE) === 'true'
      : readEnv(process.env.NODE_ENV) === 'production',
    // Tokens issued before sessions existed carry no session id. They are
    // refused by default; set ALLOW_LEGACY_TOKENS=true only for a short
    // rollout window while old logins are still around.
    allowLegacyTokens: readEnv(process.env.ALLOW_LEGACY_TOKENS) === 'true',
    // How long a "session is active" answer is remembered, in seconds.
    // On another server instance a logout takes effect within this window.
    sessionCacheSeconds: readEnv(process.env.SESSION_CACHE_SECONDS)
      ? parseInt(readEnv(process.env.SESSION_CACHE_SECONDS), 10)
      : 30,
    // One login at a time per employee.
    //   replace  a new sign-in ends the older ones (default)
    //   block    a new sign-in is refused while another device was active
    //            within singleSessionActiveWindowSeconds (needs the browser
    //            heartbeat to be accurate)
    //   off      any number of logins
    singleSessionMode: ['replace', 'block', 'off'].includes(
      readEnv(process.env.SINGLE_SESSION_MODE),
    )
      ? readEnv(process.env.SINGLE_SESSION_MODE)
      : 'replace',
    singleSessionActiveWindowSeconds: readEnv(process.env.SESSION_ACTIVE_WINDOW_SECONDS)
      ? parseInt(readEnv(process.env.SESSION_ACTIVE_WINDOW_SECONDS), 10)
      : 120,
    // Old session rows are deleted by the backend itself (SQL Server Express
    // has no SQL Agent). Rows ended or expired longer ago than the retention
    // period are removed, in small batches.
    sessionPurge: {
      enabled: readEnv(process.env.SESSION_PURGE_ENABLED) !== 'false',
      intervalHours: readEnv(process.env.SESSION_PURGE_INTERVAL_HOURS)
        ? parseInt(readEnv(process.env.SESSION_PURGE_INTERVAL_HOURS), 10)
        : 24,
      retentionDays: readEnv(process.env.SESSION_PURGE_RETENTION_DAYS)
        ? parseInt(readEnv(process.env.SESSION_PURGE_RETENTION_DAYS), 10)
        : 30,
    },
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
    // Development aid: return the answer with the captcha so scripts can log in.
    // Off unless explicitly turned on; never turn it on in production.
    debugAnswer: readEnv(process.env.CAPTCHA_DEBUG_ANSWER) === 'true',
  },
});
