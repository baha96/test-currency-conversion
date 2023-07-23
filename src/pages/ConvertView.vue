<script setup lang="ts">
import ConvertCard from "../components/rates/ConvertCard.vue";
import DefaultTitle from "../components/shared/typography/DefaultTitle.vue";

import { ref } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useExchangeRates } from "../store/exchangeRates.ts";
import { formatDate } from "../utils.ts";

const store = useExchangeRates();
const route = useRoute();
const { getExchangeRateData } = storeToRefs(store);
const { getDataRates, convertWithCurrency } = store;
const fromCurrency = ref(route.query.from || getExchangeRateData.value.base);
const toCurrency = ref(route.query.to || getExchangeRateData.value.base);
const fromValue = ref(route.query.value || "1");
const toValue = ref(route.query.total || "0");

if (!getExchangeRateData.value.items.length) {
  getDataRates();
}

let timerDebounce;

function changeValue(val, currencyFrom, currencyTo) {
  fromCurrency.value = currencyFrom;
  toCurrency.value = currencyTo;
  fromValue.value = val;
  clearTimeout(timerDebounce);
  timerDebounce = setTimeout(() => {
    toValue.value = convertWithCurrency(+val, currencyFrom, currencyTo);
  }, 400);
}
</script>

<template>
  <div v-if="getExchangeRateData">
    <DefaultTitle tag="h1" class="text-3xl mb-6">
      Конвертер, {{ formatDate(getExchangeRateData.date) }}
    </DefaultTitle>

    <div class="flex items-center justify-between">
      <ConvertCard
        title="Из"
        :currency="fromCurrency"
        @change:currency="changeValue(fromValue, $event, toCurrency)"
        @change:input="changeValue($event, fromCurrency, toCurrency)"
        :value="fromValue"
        :isDisabled="false"
      />

      <div @click="changeValue(toValue, toCurrency, fromCurrency)">
        <svg
          class="cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 16 16"
        >
          <path fill="#444444" d="M16 5v2h-13v2l-3-3 3-3v2z" />
          <path fill="#444444" d="M0 12v-2h13v-2l3 3-3 3v-2z" />
        </svg>
      </div>

      <ConvertCard
        title="В"
        :currency="toCurrency"
        @change:currency="changeValue(fromValue, fromCurrency, $event)"
        :value="toValue"
        :isDisabled="true"
      />
    </div>
  </div>
</template>

<style scoped></style>
