import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
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
  constructor(private readonly bitcoinPriceService: BitcoinPriceService) {}
  @WebSocketServer()
  public server: Server;

  handleConnection(@ConnectedSocket() client: any) {
    // console.log(
    //   `user ${client.user.id} with socket ${client.id} connected with device ${client.handshake?.query?.deviceId}`,
    // );

    client.join(getUserDeviceRoom('1234', '4321'));
  }

  handleDisconnect(@ConnectedSocket() client: any) {
    // console.log(
    //   `user ${client.user.id} with socket ${client.id} with device ${client.handshake?.query?.deviceId} DISCONNECTED`,
    // );

    client.leave(getUserDeviceRoom('1234', '4321'));
  }

  @SubscribeMessage(TimerEvents.timerStart.toString())
  startMyTimer(@ConnectedSocket() client: any, @MessageBody() body: any): void {
    // Stop any existing timer for this user device.
    stopTimerForUserDevice('1234', '4321');

    // Start a new timer for this user device.
    startTimerForUserDevice(
      this.server,
      '1234',
      '4321',
      this.bitcoinPriceService,
      5000,
    );
  }

  @SubscribeMessage(TimerEvents.timerStop.toString())
  stopMyTimer(@ConnectedSocket() client: any): void {
    // Stop current timer for this user device.
    stopTimerForUserDevice('1234', '4321');
  }
}
