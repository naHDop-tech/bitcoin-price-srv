import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from '@root/app.module';
import { AuthenticatedSocketAdapter } from '@root/gateway/socket.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new AuthenticatedSocketAdapter(app));

  const config: ConfigService = app.get(ConfigService);

  await app.listen(config.get<string>('APP_PORT'));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
