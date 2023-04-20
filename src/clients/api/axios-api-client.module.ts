import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AxiosApiClientService } from '@root/clients/api/axios-api-client.service';

@Module({
  providers: [
    {
      inject: [ConfigService],
      provide: AxiosApiClientService,
      useFactory(config: ConfigService): AxiosApiClientService {
        return new AxiosApiClientService(
          config.get<string>('BITCOIN_API_BASE_URL'),
        );
      },
    },
  ],
  exports: [AxiosApiClientService],
})
export class AxiosApiClientModule {}
