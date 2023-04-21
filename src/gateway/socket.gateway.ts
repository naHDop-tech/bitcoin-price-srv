import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { Server } from 'socket.io';

import {
  getUserDeviceRoom,
  startTimerForUserDevice,
  stopTimerForUserDevice,
  TimerEvents,
} from '@root/gateway/tick-resolver';
import { BitcoinPriceService } from '@root/bitcoin-price/bitcoin-price.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'btc-ticker',
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly bitcoinPriceService: BitcoinPriceService,
    private readonly configService: ConfigService,
  ) {}
  @WebSocketServer()
  public server: Server;

  handleConnection(@ConnectedSocket() socket: any) {
    socket.join(getUserDeviceRoom(socket.id, socket.client.conn.id));
  }

  handleDisconnect(@ConnectedSocket() socket: any) {
    stopTimerForUserDevice(socket.id, socket.client.conn.id);
    socket.leave(getUserDeviceRoom(socket.id, socket.client.conn.id));
  }

  @SubscribeMessage(TimerEvents.startBtcTicker.toString())
  startMyTimer(@ConnectedSocket() socket: any, @MessageBody() body: any): void {
    // Stop any existing timer for this user device.
    stopTimerForUserDevice(socket.id, socket.client.conn.id);

    // Start a new timer for this user device.
    startTimerForUserDevice(
      this.server,
      socket.id,
      socket.client.conn.id,
      this.bitcoinPriceService,
      this.configService.get<number>('UPDATE_FREQUENCY_MS'),
    );
  }

  @SubscribeMessage(TimerEvents.stopBtcTicker.toString())
  stopMyTimer(@ConnectedSocket() socket: any): void {
    stopTimerForUserDevice(socket.id, socket.client.conn.id);
  }
}
