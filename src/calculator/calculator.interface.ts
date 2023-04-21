import { IBitcoinPrice } from '@root/bitcoin-price/bitcoin-price.interface';

export interface ICommissionCalculator {
  calculate(bitcoin: IBitcoinPrice): ICommissionPrice;
}

export interface ICommissionPrice {
  askPrice: string;
  askCommission: string;
  bidPrice: string;
  bidCommission: string;
}

export enum ICurrency {
  USD = 'USD',
  EUR = 'EUR',
}
