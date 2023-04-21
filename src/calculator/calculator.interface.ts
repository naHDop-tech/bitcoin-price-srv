import { IBitcoinPrice } from '@root/bitcoin-price/bitcoin-price.interface';

export interface ICommissionCalculator {
  calculate(bitcoin: IBitcoinPrice): ICommissionPrice;
}

export interface ICommissionPrice {
  symbol: string;
  askPrice: string;
  bidPrice: string;
  commission: string;
  midRateWithCommission: string;
}

export enum ICurrency {
  USD = 'USD',
  EUR = 'EUR',
}
