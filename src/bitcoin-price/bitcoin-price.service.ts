import { Injectable } from '@nestjs/common';

import { CommissionCalculatorService } from '@root/calculator/commission-calculator.service';
import { ICommissionPrice } from '@root/calculator/calculator.interface';
import { BitcoinService } from '@root/bitcoin/bitcoin.service';

@Injectable()
export class BitcoinPriceService {
  constructor(
    private readonly bitcoinService: BitcoinService,
    private readonly commissionService: CommissionCalculatorService,
  ) {}

  async getBitcoinPrice(): Promise<ICommissionPrice> {
    try {
      const result = await this.bitcoinService.getPriceInfo();
      return this.commissionService.calculate(result);
    } catch (err) {
      console.error(err.message);
      return {
        askPrice: '',
        bidPrice: '',
        midRateWithCommission: '',
        symbol: '',
      };
    }
  }
}
