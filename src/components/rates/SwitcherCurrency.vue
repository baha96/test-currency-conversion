<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useExchangeRates } from "../../store/exchangeRates.ts";
import DefaultTitle from "../shared/typography/DefaultTitle.vue";

const store = useExchangeRates();
const { getCurrencies } = storeToRefs(store);
const { changeBaseCurrency } = store;

const props = defineProps<{
  isGlobalChange?: boolean;
  baseCurrency: string;
}>();

const emit = defineEmits(["get:currency"]);

function changeBase(val: string) {
  if (props.isGlobalChange) {
    changeBaseCurrency(val);
  } else {
    emit("get:currency", val);
  }
}
</script>

<template>
  <div class="switcher-currency flex items-center">
    <DefaultTitle v-if="isGlobalChange" tag="h6" class="font-bold mr-2">
      Основная валюта:
    </DefaultTitle>

    <select
      @input="changeBase(($event.target as HTMLSelectElement).value)"
      class="outline-0"
      :class="{ 'text-1xl font-bold': !isGlobalChange }"
    >
      <option>{{ baseCurrency }}</option>

      <option
        v-for="item in getCurrencies"
        :key="item"
        :value="item"
        :selected="item === baseCurrency"
      >
        {{ item }}
      </option>
    </select>
  </div>
</template>
