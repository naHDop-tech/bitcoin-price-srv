import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommissionCalculatorService } from '@root/calculator/commission-calculator.service';
import { FormatterModule } from '@root/formattor/formatter.module';

@Module({
  imports: [ConfigModule, FormatterModule],
  providers: [CommissionCalculatorService],
  exports: [CommissionCalculatorService],
})
export class CommissionCalculatorModule {}
