import * as Joi from 'joi';

export default Joi.object({
  PORT: Joi.number().required(),

  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production', 'staging')
    .default('development'),

  // --- Production Database Variables ---
  DATABASE_HOST_PRODUCTION: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  DATABASE_PORT_PRODUCTION: Joi.number().port().default(5432),
  DATABASE_USERNAME_PRODUCTION: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  DATABASE_PASSWORD_PRODUCTION: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  DATABASE_NAME_PRODUCTION: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  // --- Development Database Variables ---
  DATABASE_HOST_DEVELOPMENT: Joi.string().when('NODE_ENV', {
    is: 'development',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  DATABASE_PORT_DEVELOPMENT: Joi.number().port().default(5432),
  DATABASE_USERNAME_DEVELOPMENT: Joi.string().when('NODE_ENV', {
    is: 'development',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  DATABASE_PASSWORD_DEVELOPMENT: Joi.string().when('NODE_ENV', {
    is: 'development',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  DATABASE_NAME_DEVELOPMENT: Joi.string().when('NODE_ENV', {
    is: 'development',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  // --- JWT ---
  JWT_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRATION: Joi.string().required(),
  JWT_REFRESH_EXPIRATION: Joi.string().required(),
});
