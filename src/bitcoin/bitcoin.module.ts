import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BitcoinService } from '@root/bitcoin/bitcoin.service';
import { BitcoinEntity } from '@root/bitcoin/bitcoin.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([BitcoinEntity])],
  providers: [BitcoinService],
  exports: [BitcoinService],
})
export class BitcoinModule {}
