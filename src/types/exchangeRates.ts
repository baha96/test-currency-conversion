export interface iRateItem {
  ID: string;
  NumCode: string;
  CharCode: string;
  Nominal: number;
  Name: string;
  Value: number;
  Previous: number;
  state: "up" | "down" | "";
}

export interface iDailyJson {
  Date: string;
  Valute: {
    [key: string]: iRateItem;
  };
}

export interface iExchangeRate {
  date: Date | null;
  base: string;
  items: iRateItem[];
}

export type currenciesType = string[];
