import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class WebsocketService {
  serverInstance: Server = null;

  set server(server: Server) {
    this.serverInstance = server;
    server.on('connection', (client: Socket) => this.handleConnection(client));
    server.on('disconnect', (client: Socket) => this.handleDisconnect(client));
  }

  get server(): Server {
    return this.serverInstance;
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  emitEvent(event: string, data: any) {
    this.server.emit(event, data);
  }
}
