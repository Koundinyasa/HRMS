import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3001),
  FRONTEND_URL: Joi.string().uri().default('http://localhost:5173'),

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
  JWT_EXPIRES_IN: Joi.string().default('15m'),

  // Mail
  EMAIL_USER: Joi.string().email().required(),
  EMAIL_PASS: Joi.string().required(),

  // Captcha
  CAPTCHA_TTL_MINUTES: Joi.number().default(5),
});