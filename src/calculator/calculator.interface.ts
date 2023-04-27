import { IBitcoinPrice } from '@root/bitcoin-price/bitcoin-price.interface';
import { Decimal } from 'decimal.js';

export interface ICommissionCalculator {
  calculate(bitcoin: IBitcoinPrice): ICommissionPrice;
  getPriceWithCommission(price: Decimal, commission: Decimal): Decimal;
}

export interface ICommissionPrice {
  symbol: string;
  askPrice: string;
  bidPrice: string;
  midRateWithCommission: string;
}
