import { Controller, Get } from '@nestjs/common';

import { BitcoinPriceService } from '@root/bitcoin-price/bitcoin-price.service';
import { ICommissionPrice } from '@root/calculator/calculator.interface';
import { BitcoinService } from '@root/bitcoin/bitcoin.service';
import { BitcoinEntity } from '@root/bitcoin/bitcoin.entity';

@Controller('/api/v0')
export class BitcoinPriceController {
  constructor(
    private readonly bitcoinPriceService: BitcoinPriceService,
    private readonly bitcoinService: BitcoinService,
  ) {}

  @Get('/bitcoin-price')
  getBitcoinPrice(): Promise<ICommissionPrice> {
    return this.bitcoinPriceService.getBitcoinPrice();
  }

  @Get('/price')
  getPrice(): Promise<BitcoinEntity> {
    return this.bitcoinService.getPriceInfo();
  }
}
