import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  ICommissionCalculator,
  ICommissionPrice,
} from '@root/calculator/calculator.interface';
import { IBitcoinPrice } from '@root/bitcoin-price/bitcoin-price.interface';

@Injectable()
export class CommissionCalculatorService implements ICommissionCalculator {
  constructor(private readonly configService: ConfigService) {}
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
