import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { apolloIoConfigFactory } from './apollo-io-config.factory';
import { ApolloIoService } from './services';

@Module({
  imports: [ConfigModule.forFeature(apolloIoConfigFactory), HttpModule],
  providers: [ApolloIoService],
  exports: [ApolloIoService],
})
export class ApolloIoModule {}
