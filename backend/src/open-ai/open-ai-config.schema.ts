import * as Joi from 'joi';

const schema = {
  OPENAI_API_KEY: Joi.string().required(),
};

export const openAiConfigSchema = Joi.object<typeof schema>(schema);
