import { Module } from '@nestjs/common';
import { FormatterService } from '@root/formattor/formatter.service';

@Module({
  imports: [],
  providers: [FormatterService],
  exports: [FormatterService],
})
export class FormatterModule {}
