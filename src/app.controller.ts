import { Controller, Get } from '@nestjs/common';

import { AppService } from '@root/app.service';

@Controller('/api/v0')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  health(): string {
    return this.appService.healthCheck();
  }
}
