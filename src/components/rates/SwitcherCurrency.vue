<script setup lang="ts">
import DefaultTitle from "../shared/typography/DefaultTitle.vue";
import { useExchangeRates } from "../../store/exchangeRates.ts";
const store = useExchangeRates();
import { storeToRefs } from "pinia";
const { getExchangeRateData, getCurrencies } = storeToRefs(store);
const { changeBaseCurrency } = store;
</script>

<template>
  <div v-if="getExchangeRateData" class="switcher-currency flex items-center">
    <DefaultTitle tag="h6" class="font-bold">Основная валюта:</DefaultTitle>
    <select
      @input="changeBaseCurrency($event.target.value)"
      class="ml-2 outline-0"
    >
      <option selected>{{ getExchangeRateData.base }}</option>
      <option
        v-for="item in getCurrencies"
        :key="item"
        :value="item"
        v-show="item !== getExchangeRateData.base"
      >
        {{ item }}
      </option>
    </select>
  </div>
</template>
