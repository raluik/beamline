import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { apolloIoConfigFactory } from './apollo-io-config.factory';
import { OpenAiModule } from '../open-ai/open-ai.module';
import { ApolloIoService } from './services';

@Module({
  imports: [ConfigModule.forFeature(apolloIoConfigFactory), HttpModule, OpenAiModule],
  providers: [ApolloIoService],
  exports: [ApolloIoService],
})
export class ApolloIoModule {}
