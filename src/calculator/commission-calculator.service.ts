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

    const askPrice = this.addingFloating(bitcoin.askPrice, askCommission);
    const bidPrice = this.addingFloating(bitcoin.bidPrice, bidCommission);

    return {
      askPrice,
      askCommission,
      bidCommission,
      bidPrice,
    };
  }

  // avoid floating problem
  // 0.01 + 0.02 -> 0.3000000000004
  private addingFloating(price: string, commission: string): string {
    const result =
      (this.usdConvertorService.toFloat(price) * 10 +
        this.usdConvertorService.toFloat(commission) * 10) /
      10;

    return this.usdConvertorService.toString(result);
  }
}
