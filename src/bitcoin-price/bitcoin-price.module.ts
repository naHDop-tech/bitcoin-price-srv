import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BitcoinPriceService } from '@root/bitcoin-price/bitcoin-price.service';
import { BitcoinPriceController } from '@root/bitcoin-price/bitcoin-price.controller';
import { CommissionCalculatorModule } from '@root/calculator/commission-calculator.module';
import { BitcoinModule } from '@root/bitcoin/bitcoin.module';

@Module({
  imports: [ConfigModule, CommissionCalculatorModule, BitcoinModule],
  providers: [BitcoinPriceService],
  controllers: [BitcoinPriceController],
  exports: [BitcoinPriceService],
})
export class BitcoinPriceModule {}
