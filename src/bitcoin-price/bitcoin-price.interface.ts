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
   * The lowest price at which a seller will sell the stock
   * */
  askPrice: string;
}
