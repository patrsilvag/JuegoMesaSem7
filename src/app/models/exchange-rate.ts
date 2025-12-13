export interface ExchangeRateResponse {
  base: string;
  date: string;
  rates: {
    [currency: string]: number;
  };
}
