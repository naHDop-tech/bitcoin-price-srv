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

    const askData = this.addingFloating(bitcoin.askPrice, askCommission);
    const bidData = this.addingFloating(bitcoin.bidPrice, bidCommission);

    return {
      askPrice: askData.price,
      askCommission: askData.commission,
      bidCommission: bidData.commission,
      bidPrice: bidData.price,
    };
  }

  // avoid floating problem
  // 0.01 + 0.02 -> 0.3000000000004
  private addingFloating(
    price: string,
    commission: string,
  ): { price: string; commission: string } {
    const parsedPrice = this.usdConvertorService.toFloat(price);
    const parsedCommission =
      this.usdConvertorService.toFloat(price) *
      this.usdConvertorService.toFloat(commission);
    const totalPrice = (parsedPrice * 10 + parsedCommission * 10) / 10;

    return {
      price: this.usdConvertorService.toString(totalPrice),
      commission: this.usdConvertorService.toString(parsedCommission)
    };
  }
}
