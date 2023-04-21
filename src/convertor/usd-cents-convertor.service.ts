import { Injectable } from '@nestjs/common';

@Injectable()
export class UsdCentsConvertorService {
  /*
   * from full dollars to cents
   * */
  toFloat(amount: string): number {
    return parseFloat(amount);
  }

  /*
   * from cents to full dollar
   * */
  toString(cents: number): string {
    const [startPad, endPad] = String(cents).split('.');
    return startPad + '.' + endPad?.padEnd(8, '0');
  }
}
