import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from '@root/app.controller';
import { AppService } from '@root/app.service';
import { AxiosApiClientModule } from '@root/clients/api/axios-api-client.module';
import { BitcoinPriceModule } from '@root/bitcoin-price/bitcoin-price.module';
import { CommissionCalculatorModule } from '@root/calculator/commission-calculator.module';
import { UsdCentsConvertorModule } from '@root/convertor/usd-cunts-convertor.module';
import { SocketModule } from '@root/gateway/socket.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    // Modules
    AxiosApiClientModule,
    BitcoinPriceModule,
    CommissionCalculatorModule,
    UsdCentsConvertorModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
