import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Decimal } from 'decimal.js';

import {
  ICommissionCalculator,
  ICommissionPrice,
} from '@root/calculator/calculator.interface';
import { IBitcoinPrice } from '@root/bitcoin-price/bitcoin-price.interface';
import { FormatterService } from '@root/formattor/formatter.service';

@Injectable()
export class CommissionCalculatorService implements ICommissionCalculator {
  // Middle rate = (bid rate + ask rate) ÷ 2
  constructor(
    private readonly configService: ConfigService,
    private readonly usdConvertorService: FormatterService,
  ) {}
  calculate(bitcoin: IBitcoinPrice): ICommissionPrice {
    const commission = this.configService.get<string>(
      'BITCOIN_MIDRATE_COMMISSION',
    );

    // avoid floating calculation by decimal.js lib
    // 0.01 + 0.02 -> 0.3000000000004
    const bidD = new Decimal(bitcoin.bidPrice);
    const askD = new Decimal(bitcoin.askPrice);
    const cD = new Decimal(commission);

    // Commission to bid
    const bidDWithCom = this.getPriceWithCommission(bidD, cD);
    // commission to ask
    const askDWithCom = this.getPriceWithCommission(askD, cD);
    // mid rate
    const midRateWithComm = bidDWithCom.plus(askDWithCom).dividedBy(2);

    return {
      symbol: bitcoin.symbol,
      askPrice: bitcoin.askPrice,
      bidPrice: bitcoin.bidPrice,
      midRateWithCommission: this.usdConvertorService.toString(
        midRateWithComm.toNumber(),
      ),
    };
  }

  getPriceWithCommission(price: Decimal, commission: Decimal): Decimal {
    const comm = price.mul(commission);
    return price.plus(comm);
  }
}
