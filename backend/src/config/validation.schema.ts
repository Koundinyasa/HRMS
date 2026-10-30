import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3001),

  // Allowed CORS origin(s): one http(s) URL, or several separated by commas.
  // Required in production so a deployment can never fall back to localhost.
  FRONTEND_URL: Joi.string()
    .pattern(
      /^https?:\/\/[^\s,]+(\s*,\s*https?:\/\/[^\s,]+)*$/,
      'one or more http(s) URLs separated by commas',
    )
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional().default('http://localhost:5173'),
    }),

  // Swagger UI in production (always on in development). Admin login required.
  SWAGGER_ENABLED: Joi.boolean().default(false),

  // Number of reverse proxies in front of the app, so the real client IP is
  // used for rate limiting. 0 when the app is exposed directly.
  TRUST_PROXY: Joi.number().integer().min(0).default(0),

  // SQL Server
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(1433),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_ENCRYPT: Joi.boolean().default(false),
  DB_TRUST_SERVER_CERT: Joi.boolean().default(true),

  // JWT - required, no silent fallback allowed
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'), // no longer used; see ACCESS_TOKEN_TTL

  // Login sessions
  ACCESS_TOKEN_TTL: Joi.string()
    .pattern(/^\d+\s*[smhd]?$/, 'a number of seconds, or a number with s, m, h or d')
    .default('15m'),
  SESSION_IDLE_MINUTES: Joi.number().integer().min(1).default(60),
  SESSION_ABSOLUTE_MINUTES: Joi.number().integer().min(1).default(1440),
  COOKIE_SECURE: Joi.boolean().allow('').optional(), // empty = default (on in production)
  ALLOW_LEGACY_TOKENS: Joi.boolean().default(false),
  // How long a "session is active" answer is cached, in seconds (0 = no cache).
  SESSION_CACHE_SECONDS: Joi.number().integer().min(0).max(300).default(30),
  // One login at a time per employee: replace | block | off.
  SINGLE_SESSION_MODE: Joi.string().valid('replace', 'block', 'off').default('replace'),
  // In block mode: a login counts as in use if it was seen this recently.
  SESSION_ACTIVE_WINDOW_SECONDS: Joi.number().integer().min(30).max(3600).default(120),
  // Removal of old session rows (done by the backend, daily by default).
  SESSION_PURGE_ENABLED: Joi.boolean().default(true),
  SESSION_PURGE_INTERVAL_HOURS: Joi.number().integer().min(1).max(168).default(24),
  SESSION_PURGE_RETENTION_DAYS: Joi.number().integer().min(1).max(3650).default(30),

  // Mail
  EMAIL_USER: Joi.string().email().required(),
  EMAIL_PASS: Joi.string().required(),

  // Captcha
  CAPTCHA_TTL_MINUTES: Joi.number().default(5),
  // Returns the captcha answer to the caller. Refused in production.
  CAPTCHA_DEBUG_ANSWER: Joi.boolean()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.boolean().valid(false),
      otherwise: Joi.boolean(),
    })
    .default(false),
});
