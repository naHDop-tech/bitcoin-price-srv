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
  // Middle rate = (bid rate + ask rate) ÷ 2

  // TODO: Do we need to avoid floating problem with adding float numbers ?
  // TODO: 0.01 + 0.02 -> 0.3000000000004
  constructor(
    private readonly configService: ConfigService,
    private readonly usdConvertorService: UsdCentsConvertorService,
  ) {}
  calculate(bitcoin: IBitcoinPrice): ICommissionPrice {
    const commission = this.configService.get<string>(
      'BITCOIN_MIDRATE_COMMISSION',
    );

    const midRate =
      (parseFloat(bitcoin.bidPrice) + parseFloat(bitcoin.askPrice)) / 2;
    const midRateWithCommission = this.calculateCommission(
      midRate,
      parseFloat(commission),
    );
    const totalCommission = midRate * parseFloat(commission);

    return {
      askPrice: bitcoin.askPrice,
      commission: String(totalCommission),
      bidPrice: bitcoin.bidPrice,
      midRateWithCommission: midRateWithCommission,
    };
  }

  private calculateCommission(
    midRatePrice: number,
    commission: number,
  ): string {
    const comm = midRatePrice * commission;
    return String(midRatePrice + comm);
  }
}
