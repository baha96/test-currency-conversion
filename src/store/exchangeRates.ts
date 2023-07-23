import { computed, ref } from "vue";
import { defineStore } from "pinia";
import {
  currenciesType,
  iDailyJson,
  iExchangeRate,
  iRateItem,
} from "../types/exchangeRates.ts";

const API = import.meta.env.VITE_OPEN_EXCHANGE_RATES_API_URL;

export const useExchangeRates = defineStore("ExchangeRates", () => {
  // State
  const baseCurrency = ref<string>("RUB");
  const itemsCached = ref<{ [key: string]: iRateItem[] }>({});
  const dailyJson = ref<iDailyJson | null>(null);
  const items = ref<iRateItem[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<any>(false);

  // getters
  const getExchangeRateData = computed((): iExchangeRate => {
    return {
      date: dailyJson.value && new Date(dailyJson.value.Date),
      base: baseCurrency.value,
      items: items.value,
    };
  });
  const isLoading = computed((): boolean => loading.value);
  const isError = computed((): any => error.value);
  const getCurrencies = computed((): currenciesType | null => {
    return dailyJson.value && Object.keys(dailyJson.value.Valute);
  });

  // actions
  const convertWithCurrency = (
    val: number,
    currencyFrom: string,
    currencyTo: string,
    sliceCount = 2,
  ) => {
    return (
      window
        // @ts-ignore
        .fx(val)
        .from(currencyFrom)
        .to(currencyTo)
        .toFixed(sliceCount)
    );
  };

  const changeBaseCurrency = (newCurrency: string) => {
    baseCurrency.value = newCurrency;

    if (itemsCached.value[baseCurrency.value]) {
      items.value = itemsCached.value[baseCurrency.value];
      return;
    }
    loading.value = true;

    setTimeout(() => {
      changeBaseValueDaily();
    }, 600);
  };

  const fetchExchangeRates = async () => {
    try {
      const res = await fetch(`${API}/daily_json.js`);
      const data = await res.json();

      if (data.error) {
        throw data.description || data.message;
      }
      dailyJson.value = data;
    } catch (err) {
      throw err;
    }
  };

  const trend = (current: number, previous: number) => {
    if (current > previous) return "up";
    if (current < previous) return "down";
    return "";
  };

  const changeBaseValueDaily = () => {
    if (!dailyJson.value) return;
    error.value = false;
    items.value = [];
    try {
      for (const currency in dailyJson.value.Valute) {
        const item = dailyJson.value.Valute[currency];
        const newVal = convertWithCurrency(
          item.Nominal,
          currency,
          baseCurrency.value,
        );

        items.value.push({
          ...dailyJson.value.Valute[currency],
          Value: +newVal,
          Previous: +newVal,
          state: "",
        });
      }

      itemsCached.value[baseCurrency.value] = items.value;
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  const getDataRates = async () => {
    loading.value = true;
    error.value = false;
    items.value = [];
    try {
      if (itemsCached.value[baseCurrency.value]) {
        items.value = itemsCached.value[baseCurrency.value];
        return;
      }

      await fetchExchangeRates();

      if (!dailyJson.value) return;

      for (const currency in dailyJson.value.Valute) {
        const item = dailyJson.value.Valute[currency];
        items.value.push({
          ...dailyJson.value.Valute[currency],
          state: trend(+item.Value, +item.Previous),
        });
      }
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  return {
    // getters
    getExchangeRateData,
    isLoading,
    isError,
    getCurrencies,

    // actions
    convertWithCurrency,
    changeBaseCurrency,
    getDataRates,
  };
});
