import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  ICommissionCalculator,
  ICommissionPrice,
} from '@root/calculator/calculator.interface';
import { IBitcoinPrice } from '@root/bitcoin-price/bitcoin-price.interface';
import { UsdCentsConvertorService } from '@root/convertor/usd-cents-convertor.service';

@Injectable()
export class CommissionCalculatorService implements ICommissionCalculator {
  constructor(
    private readonly configService: ConfigService,
    private readonly usdConvertorService: UsdCentsConvertorService,
  ) {}
  calculate(bitcoin: IBitcoinPrice): ICommissionPrice {
    const askCommission = this.configService.get<string>(
      'BITCOIN_ASK_COMMISSION',
    );
    const bidCommission = this.configService.get<string>(
      'BITCOIN_BID_COMMISSION',
    );

    // avoid floating problem
    // 0.01 + 0.02 -> 0.3000000000004
    const askPrice =
      (this.usdConvertorService.toLowerCurrency(bitcoin.askPrice) * 10 +
        this.usdConvertorService.toLowerCurrency(askCommission) * 10) /
      10;
    const bidPrice =
      (this.usdConvertorService.toLowerCurrency(bitcoin.bidPrice) * 10 +
        this.usdConvertorService.toLowerCurrency(bidCommission) * 10) /
      10;
    return {
      askPrice: this.usdConvertorService.toHigherCurrency(askPrice),
      askCommission,
      bidCommission,
      bidPrice: this.usdConvertorService.toHigherCurrency(bidPrice),
    };
  }
}
