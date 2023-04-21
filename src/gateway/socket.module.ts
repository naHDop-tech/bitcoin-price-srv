import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SocketGateway } from '@root/gateway/socket.gateway';
import { BitcoinPriceModule } from '@root/bitcoin-price/bitcoin-price.module';

@Module({
  imports: [BitcoinPriceModule, ConfigModule],
  providers: [SocketGateway],
})
export class SocketModule {}
