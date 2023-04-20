import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AxiosApiClientModule } from '@root/clients/api/axios-api-client.module';
import { BitcoinPriceService } from '@root/bitcoin-price/bitcoin-price.service';
import { BitcoinPriceController } from '@root/bitcoin-price/bitcoin-price.controller';

@Module({
  imports: [ConfigModule, AxiosApiClientModule],
  providers: [BitcoinPriceService],
  controllers: [BitcoinPriceController],
})
export class BitcoinPriceModule {}
