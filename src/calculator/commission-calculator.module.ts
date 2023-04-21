import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommissionCalculatorService } from '@root/calculator/commission-calculator.service';

@Module({
  imports: [ConfigModule],
  providers: [CommissionCalculatorService],
  exports: [CommissionCalculatorService],
})
export class CommissionCalculatorModule {}
