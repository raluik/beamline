import { registerAs } from '@nestjs/config';

import { openAiConfigSchema } from './open-ai-config.schema';
import { OpenAiConfig } from './interfaces';
import { ConfigUtil } from '../utils';

export const openAiConfigFactory = registerAs('openAi', (): OpenAiConfig => {
  const env = ConfigUtil.validate(openAiConfigSchema);

  return {
    apiKey: <string>env.OPENAI_API_KEY,
  };
});
