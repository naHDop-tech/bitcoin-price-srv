import { Module } from '@nestjs/common';
import { SocketGateway } from '@root/gateway/socket.gateway';
import { BitcoinPriceModule } from '@root/bitcoin-price/bitcoin-price.module';

@Module({
  imports: [BitcoinPriceModule],
  providers: [SocketGateway],
})
export class SocketModule {}
