import { Controller, Get } from '@nestjs/common';

import { BitcoinPriceService } from '@root/bitcoin-price/bitcoin-price.service';
import { ICommissionPrice } from '@root/calculator/calculator.interface';

@Controller('/api/v0')
export class BitcoinPriceController {
  constructor(private readonly bitcoinPriceService: BitcoinPriceService) {}

  @Get('/bitcoin-price')
  getBitcoinPrice(): Promise<ICommissionPrice> {
    return this.bitcoinPriceService.getBitcoinPrice();
  }
}
