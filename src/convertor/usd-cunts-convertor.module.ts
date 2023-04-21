import { Module } from '@nestjs/common';
import { UsdCentsConvertorService } from '@root/convertor/usd-cents-convertor.service';

@Module({
  imports: [],
  providers: [UsdCentsConvertorService],
  exports: [UsdCentsConvertorService],
})
export class UsdCentsConvertorModule {}
