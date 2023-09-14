import { registerAs } from '@nestjs/config';

import { apolloIoConfigSchema } from './apollo-io-config.schema';
import { ApolloIoConfig } from './interfaces';
import { ConfigUtil } from '../utils';

export const apolloIoConfigFactory = registerAs('apolloIo', (): ApolloIoConfig => {
  const env = ConfigUtil.validate(apolloIoConfigSchema);

  return {
    apiKey: <string>env.APOLLO_IO_API_KEY,
  };
});
