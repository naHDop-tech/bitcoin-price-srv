import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from '@root/app.controller';
import { AppService } from '@root/app.service';
import { AxiosApiClientModule } from '@root/clients/api/axios-api-client.module';
import { BitcoinPriceModule } from '@root/bitcoin-price/bitcoin-price.module';
import { CommissionCalculatorModule } from '@root/calculator/commission-calculator.module';
import { FormatterModule } from '@root/formattor/formatter.module';
import { BitcoinEntity } from '@root/bitcoin/bitcoin.entity';
import { BitcoinModule } from '@root/bitcoin/bitcoin.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    // Data base
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [BitcoinEntity],
          synchronize: true,
        };
      },
    }),
    // Modules
    AxiosApiClientModule,
    BitcoinPriceModule,
    CommissionCalculatorModule,
    FormatterModule,
    BitcoinModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
