import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AxiosApiClientService } from '@root/clients/api/axios-api-client.service';

@Injectable()
export class BitcoinPriceService {
  private bitcoinPriceUrlPath: string;
  private bitcoinSymbol: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly apiClient: AxiosApiClientService,
  ) {
    this.bitcoinPriceUrlPath = '/api/v3/ticker/bookTicker';
    this.bitcoinSymbol = configService.get<string>('BITCOIN_SYMBOL');
  }

  async getBitcoinPrice(): Promise<any> {
    return Promise.resolve('334');
  }
}
