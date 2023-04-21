export interface IBitcoinPrice {
  /*
   * bitcoin's label
   * */
  symbol: string;
  /*
   * The highest price a buyer will pay to buy
   * */
  bidPrice: string;
  /*
   * The maximum price the buyer or a group of buyers are ready to pay for
   * */
  bidQty: string;
  /*
   * The lowest price at which a seller will sell the stock
   * */
  askPrice: string;
  /*
   * The price at which seller is ready to sell any stock or commodity
   * */
  askQty: string;
}

export interface IBitcoinPriceWithCommission
  extends Omit<IBitcoinPrice, 'bidQty' | 'askQty'> {
  askCommission: string;
  bidCommission: string;
}
