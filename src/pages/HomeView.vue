<script setup lang="ts">
import RateCard from "../components/rates/RateCard.vue";
import DefaultTitle from "../components/shared/typography/DefaultTitle.vue";
import SwitcherCurrency from "../components/rates/SwitcherCurrency.vue";
import SearchInput from "../components/shared/SearchInput.vue";

import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useExchangeRates } from "../store/exchangeRates.ts";
import { iRateItem } from "../types/exchangeRates.ts";
const store = useExchangeRates();
const { getExchangeRateData, isLoading, isError } = storeToRefs(store);
const { getDataRates } = store;
const searchText = ref("");
getDataRates();
function formatDate(date) {
  return new Date(date).toLocaleDateString("ru-RU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function searchCurrency(text) {
  const items = getExchangeRateData.value.items || [];
  return items.filter(
    (c) =>
      c.CharCode.toLowerCase().includes(text) ||
      c.Name.toLowerCase().includes(text),
  );
}
const content = computed((): iRateItem[] => {
  if (searchText.value) {
    return searchCurrency(searchText.value);
  } else {
    return getExchangeRateData.value.items || [];
  }
});
</script>

<template>
  <div>
    <template v-if="getExchangeRateData">
      <DefaultTitle tag="h1" class="text-3xl font-bold mb-3">
        Курсы валют ЦБ РФ на {{ formatDate(getExchangeRateData.date) }}
      </DefaultTitle>
      <SwitcherCurrency class="mb-2" />
      <SearchInput @search:get="searchText = $event" />
      <div v-if="isLoading">loading....</div>
      <div v-else-if="isError">{{ isError || "error...." }}</div>
      <div v-else class="grid grid-cols-5 gap-4">
        <RateCard
          v-for="item in content"
          :key="item.CharCode"
          :baseCurrency="getExchangeRateData.base"
          :item="item"
        />
      </div>
    </template>
  </div>
</template>

<style scoped></style>