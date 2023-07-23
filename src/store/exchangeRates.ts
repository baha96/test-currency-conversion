const API = import.meta.env.VITE_OPEN_EXCHANGE_RATES_API_URL;
import { defineStore } from "pinia";
import {
  currenciesType,
  iDailyJson,
  iExchangeRate,
  iRateItem,
} from "../types/exchangeRates.ts";

type localStateType = {
  baseCurrency: string;
  ratesDate: Date;
  items: iRateItem[];
  itemsCached: {
    [key: string]: iRateItem[];
  };
  dailyJson: iDailyJson | null;
  loading: boolean;
  error: any;
};

export const useExchangeRates = defineStore("ExchangeRates", {
  state: (): localStateType => ({
    baseCurrency: "RUB",
    ratesDate: new Date(),
    itemsCached: {},
    dailyJson: null,
    items: [],
    loading: false,
    error: false,
  }),
  getters: {
    getExchangeRateData(): iExchangeRate {
      return {
        date: this.dailyJson && new Date(this.dailyJson.Date),
        base: this.baseCurrency,
        items: this.items,
      };
    },
    isLoading(): boolean {
      return this.loading;
    },
    isError(): any {
      return this.error;
    },
    getCurrencies(): currenciesType | null {
      return this.dailyJson && Object.keys(this.dailyJson.Valute);
    },
  },
  actions: {
    convertWithCurrency(
      val: number,
      currencyFrom: string,
      currencyTo: string,
      sliceCount = 2,
    ) {
      return (
        window
          // @ts-ignore
          .fx(val)
          .from(currencyFrom)
          .to(currencyTo)
          .toFixed(sliceCount)
      );
    },
    changeBaseCurrency(newCurrency: string) {
      this.baseCurrency = newCurrency;
      if (this.itemsCached[this.baseCurrency]) {
        this.items = this.itemsCached[this.baseCurrency];
        return;
      }
      this.loading = true;
      setTimeout(() => {
        this.changeBaseValueDaily();
      }, 600);
    },
    async fetchExchangeRates() {
      try {
        const res = await fetch(`${API}/daily_json.js`);
        const data = await res.json();
        if (data.error) {
          throw data.description || data.message;
        }
        this.dailyJson = data;
      } catch (err) {
        throw err;
      }
    },
    trend(current: number, previous: number) {
      if (current > previous) return "up";
      if (current < previous) return "down";
      return "";
    },
    changeBaseValueDaily() {
      if (!this.dailyJson) return;
      this.error = false;
      this.items = [];
      try {
        for (const currency in this.dailyJson.Valute) {
          const item = this.dailyJson.Valute[currency];

          const newVal = this.convertWithCurrency(
            item.Nominal,
            currency,
            this.baseCurrency,
          );
          this.items.push({
            ...this.dailyJson.Valute[currency],
            Value: +newVal,
            Previous: +newVal,
            state: "",
          });
        }
        this.itemsCached[this.baseCurrency] = this.items;
      } catch (e: any) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
    async getDataRates() {
      this.loading = true;
      this.error = false;
      this.items = [];
      try {
        if (this.itemsCached[this.baseCurrency]) {
          this.items = this.itemsCached[this.baseCurrency];
          return;
        }
        await this.fetchExchangeRates();
        if (!this.dailyJson) return;
        this.items = [];
        for (const currency in this.dailyJson.Valute) {
          const item = this.dailyJson.Valute[currency];
          this.items.push({
            ...this.dailyJson.Valute[currency],
            state: this.trend(+item.Value, +item.Previous),
          });
        }
      } catch (e: any) {
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
  },
});
