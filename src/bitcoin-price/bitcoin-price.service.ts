import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AxiosApiClientService } from '@root/clients/api/axios-api-client.service';
import { IBitcoinPrice } from '@root/bitcoin-price/bitcoin-price.interface';

@Injectable()
export class BitcoinPriceService {
  private readonly bitcoinPriceUrlPath: string;
  private readonly bitcoinSymbol: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly apiClient: AxiosApiClientService,
  ) {
    this.bitcoinPriceUrlPath = '/api/v3/ticker/bookTicker';
    this.bitcoinSymbol = configService.get<string>('BITCOIN_SYMBOL');
  }

  async getBitcoinPrice(): Promise<Omit<IBitcoinPrice, 'askQty' | 'bidQty'>> {
    const result = await this.apiClient.get<IBitcoinPrice>(
      this.bitcoinPriceUrlPath,
      {
        params: { symbol: this.bitcoinSymbol },
      },
    );

    return {
      symbol: result.data.symbol,
      askPrice: result.data.askPrice,
      bidPrice: result.data.bidPrice,
    };
  }
}
