import { Controller, Get, Sse } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, interval, from } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';

import { BitcoinPriceService } from '@root/bitcoin-price/bitcoin-price.service';
import { ICommissionPrice } from '@root/calculator/calculator.interface';

@Controller('/api/v0')
export class BitcoinPriceController {
  constructor(
    private readonly bitcoinPriceService: BitcoinPriceService,
    private readonly configService: ConfigService,
  ) {}

  @Get('/current-price')
  getBitcoinPrice(): Promise<ICommissionPrice> {
    return this.bitcoinPriceService.getBitcoinPrice();
  }

  @Sse('/btcustd-price')
  priceChannel(): Observable<any> {
    const updateFrequency = this.configService.get<number>(
      'UPDATE_FREQUENCY_MS',
    );

    const source = interval(updateFrequency);

    // rxjs magic
    return source.pipe(
      concatMap(() =>
        from(this.bitcoinPriceService.getBitcoinPrice()).pipe(
          map((data: ICommissionPrice) => {
            return { data };
          }),
        ),
      ),
    );
  }
}
