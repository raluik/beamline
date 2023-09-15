import { Module } from '@nestjs/common';
import { AppStateService } from './app-state.service';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  imports: [],
  providers: [AppStateService, WebsocketService, WebsocketGateway],
  exports: [AppStateService, WebsocketService],
})
export class WebsocketModule {}
