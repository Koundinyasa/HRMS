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
  COOKIE_SECURE: Joi.boolean().optional(),
  ALLOW_LEGACY_TOKENS: Joi.boolean().default(false),

  // Mail
  EMAIL_USER: Joi.string().email().required(),
  EMAIL_PASS: Joi.string().required(),

  // Captcha
  CAPTCHA_TTL_MINUTES: Joi.number().default(5),
  CAPTCHA_DEBUG_ANSWER: Joi.boolean().default(false),
});
