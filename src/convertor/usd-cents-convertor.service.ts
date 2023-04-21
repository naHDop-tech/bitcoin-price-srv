import { Injectable } from '@nestjs/common';

@Injectable()
export class UsdCentsConvertorService {
  /*
   * from full dollars to cents
   * */
  toLowerCurrency(amount: string): number {
    return parseFloat(amount);
    // const intAmount = parseFloat(amount);
    // const [int] = amount.split('.');
    //
    // return Number(
    //   intAmount
    //     .toFixed(2)
    //     .replace('.', '')
    //     .padEnd(int.length === 1 ? 3 : 4, '0'),
    // );
  }

  /*
   * from cents to full dollar
   * */
  toHigherCurrency(cents: number): string {
    return String(cents / 100);
  }
}
