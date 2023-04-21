import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Decimal } from 'decimal.js';

import {
  ICommissionCalculator,
  ICommissionPrice,
} from '@root/calculator/calculator.interface';
import { IBitcoinPrice } from '@root/bitcoin-price/bitcoin-price.interface';
import { UsdCentsConvertorService } from '@root/convertor/usd-cents-convertor.service';

@Injectable()
export class CommissionCalculatorService implements ICommissionCalculator {
  // Middle rate = (bid rate + ask rate) ÷ 2
  constructor(
    private readonly configService: ConfigService,
    private readonly usdConvertorService: UsdCentsConvertorService,
  ) {}
  calculate(bitcoin: IBitcoinPrice): ICommissionPrice {
    const commission = this.configService.get<string>(
      'BITCOIN_MIDRATE_COMMISSION',
    );

    // avoid floating calculation by decimal.js lib
    // 0.01 + 0.02 -> 0.3000000000004
    const bidDecimal = new Decimal(bitcoin.bidPrice);
    const askDecimal = new Decimal(bitcoin.askPrice);
    const commissionDecimal = new Decimal(commission);
    const midRate = bidDecimal.plus(askDecimal).dividedBy(2);
    const midRateWithCommission = this.calculateCommission(
      midRate,
      commissionDecimal,
    );
    const totalCommission = midRate.mul(commissionDecimal);

    return {
      askPrice: bitcoin.askPrice,
      commission: this.usdConvertorService.toString(totalCommission.toNumber()),
      bidPrice: bitcoin.bidPrice,
      midRateWithCommission: this.usdConvertorService.toString(
        midRateWithCommission.toNumber(),
      ),
    };
  }

  private calculateCommission(
    midRatePrice: Decimal,
    commission: Decimal,
  ): Decimal {
    const comm = midRatePrice.mul(commission);
    return midRatePrice.plus(comm);
  }
}
