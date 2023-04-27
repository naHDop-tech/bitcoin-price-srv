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

  getPriceInfo(): Promise<BitcoinEntity> {
    return this.repository.findOne({
      where: { symbol: this.bitcoinSymbol.toLowerCase() },
    });
  }
}
