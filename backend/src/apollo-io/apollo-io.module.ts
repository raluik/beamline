import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { apolloIoConfigFactory } from './apollo-io-config.factory';
import { OpenAiModule } from '../open-ai/open-ai.module';
import { ApolloIoService } from './services';
import { AppStateService } from 'src/websocket/app-state.service';
import { WebsocketModule } from 'src/websocket/websocket.module';

@Module({
  imports: [ConfigModule.forFeature(apolloIoConfigFactory), HttpModule, OpenAiModule, WebsocketModule],
  providers: [ApolloIoService, AppStateService],
  exports: [ApolloIoService, AppStateService],
})
export class ApolloIoModule {}
