import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { WebsocketService } from './websocket.service';
import { AppStateService } from './app-state.service';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;

  constructor(
    private socketService: WebsocketService,
    private appStateService: AppStateService,
  ) {}

  afterInit(server: Server) {
    this.socketService.server = server;
  }

  @SubscribeMessage('getState')
  handleMessage(client: Socket): void {
    client.emit('state', {
      status: this.appStateService.getStatus(),
      statusText: this.appStateService.getStatusText(),
    });
  }
}
