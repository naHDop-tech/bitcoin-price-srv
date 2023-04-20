import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from '@root/app.controller';
import { AppService } from '@root/app.service';
import { AxiosApiClientModule } from '@root/clients/api/axios-api-client.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    // Modules
    AxiosApiClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
