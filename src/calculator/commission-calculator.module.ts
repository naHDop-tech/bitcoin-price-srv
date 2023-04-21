import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommissionCalculatorService } from '@root/calculator/commission-calculator.service';
import { UsdCentsConvertorModule } from '@root/convertor/usd-cunts-convertor.module';

@Module({
  imports: [ConfigModule, UsdCentsConvertorModule],
  providers: [CommissionCalculatorService],
  exports: [CommissionCalculatorService],
})
export class CommissionCalculatorModule {}
