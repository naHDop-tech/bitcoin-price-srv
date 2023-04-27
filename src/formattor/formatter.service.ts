import { Injectable } from '@nestjs/common';

@Injectable()
export class FormatterService {
  /*
   * to string with zeros pad
   * */
  toString(cents: number): string {
    const [startPad, endPad] = String(cents).split('.');
    return startPad + '.' + endPad?.padEnd(8, '0');
  }
}
