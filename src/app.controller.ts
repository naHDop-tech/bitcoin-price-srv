import { Controller, Get } from '@nestjs/common';

import { AppService } from '@root/app.service';

@Controller('/api/v0')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
