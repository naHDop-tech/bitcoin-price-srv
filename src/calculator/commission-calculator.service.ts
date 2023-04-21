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

    // TODO: convert to cents
    // TODO: calculate
    // TODO: convert to USD

    const askPrice = parseFloat(bitcoin.askPrice) - parseFloat(askCommission);
    const bidPrice = parseFloat(bitcoin.bidPrice) - parseFloat(bidCommission);

    return {
      askPrice: String(askPrice),
      askCommission,
      bidCommission,
      bidPrice: String(bidPrice),
    };
  }
}
