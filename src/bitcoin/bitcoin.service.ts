import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BitcoinEntity } from '@root/bitcoin/bitcoin.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BitcoinService {
  private readonly bitcoinSymbol: string;
  constructor(
    @InjectRepository(BitcoinEntity)
    private readonly repository: Repository<BitcoinEntity>,
    private readonly configService: ConfigService,
  ) {
    this.bitcoinSymbol = configService.get<string>('BITCOIN_SYMBOL');
  }

  async getPriceInfo(): Promise<BitcoinEntity> {
    const foo = await this.repository.findOne({
      where: { symbol: this.bitcoinSymbol.toLowerCase() },
    });

    console.log('PR', foo, this.bitcoinSymbol.toLowerCase());

    return foo;
  }
}
