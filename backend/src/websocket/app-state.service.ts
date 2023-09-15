import { Inject, Injectable } from '@nestjs/common';
import { WebsocketService } from './websocket.service';

export enum AppStatus {
  IDLE = 'Idle',
  RUNNING = 'Running',
}

@Injectable()
export class AppStateService {
  private status: AppStatus = AppStatus.IDLE;

  private statusText: string;

  constructor(@Inject(WebsocketService) private socket: WebsocketService) {}

  public setStatus(status: AppStatus) {
    this.status = status;
    this.socket.emitEvent('state', { status: this.status, statusText: this.statusText });
  }

  public setStatusText(statusText: string) {
    this.statusText = statusText;
    this.socket.emitEvent('state', { status: this.status, statusText: this.statusText });
  }

  public getStatus() {
    return this.status;
  }

  public getStatusText() {}
}
