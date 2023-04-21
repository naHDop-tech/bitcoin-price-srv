import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AxiosApiClientService } from '@root/clients/api/axios-api-client.service';
import {
  IBitcoinPrice,
  IBitcoinPriceWithCommission,
} from '@root/bitcoin-price/bitcoin-price.interface';
import { CommissionCalculatorService } from '@root/calculator/commission-calculator.service';

@Injectable()
export class BitcoinPriceService {
  private readonly bitcoinPriceUrlPath: string;
  private readonly bitcoinSymbol: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly apiClient: AxiosApiClientService,
    private readonly commissionService: CommissionCalculatorService,
  ) {
    this.bitcoinPriceUrlPath = '/api/v3/ticker/bookTicker';
    this.bitcoinSymbol = configService.get<string>('BITCOIN_SYMBOL');
  }

  async getBitcoinPrice(): Promise<IBitcoinPriceWithCommission> {
    const result = await this.apiClient.get<IBitcoinPrice>(
      this.bitcoinPriceUrlPath,
      {
        params: { symbol: this.bitcoinSymbol },
      },
    );

    const priceData = this.commissionService.calculate(result.data);

    console.log(result.data);

    return {
      symbol: result.data.symbol,
      askPrice: priceData.askPrice,
      bidPrice: priceData.bidPrice,
      askCommission: priceData.askCommission,
      bidCommission: priceData.bidCommission,
    };
  }
}
