import { Controller, Get } from '@nestjs/common';
import { BitcoinPriceService } from '@root/bitcoin-price/bitcoin-price.service';

@Controller('/api/v0')
export class BitcoinPriceController {
  constructor(private readonly bitcoinPriceService: BitcoinPriceService) {}

  @Get('/bitcoin-price')
  getBitcoinPrice(): any {
    return this.bitcoinPriceService.getBitcoinPrice();
  }
}
