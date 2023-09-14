import * as Joi from 'joi';

const schema = {
  APOLLO_IO_API_KEY: Joi.string().required(),
};

export const apolloIoConfigSchema = Joi.object<typeof schema>(schema);
