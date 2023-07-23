<script setup lang="ts">
import { iRateItem } from "../../types/exchangeRates.ts";
import DefaultTitle from "../shared/typography/DefaultTitle.vue";
import DefaultParagraph from "../shared/typography/DefaultParagraph.vue";

defineProps<{
  item: iRateItem;
  baseCurrency: string;
}>();
</script>

<template>
  <router-link
    v-if="item"
    class="p-6 shadow-xl flex flex-col rounded"
    :to="`/convert/${item.CharCode}`"
  >
    <DefaultTitle tag="h5" class="font-medium text-gray-600 mb-2">
      {{ item.Name }}
    </DefaultTitle>
    <DefaultParagraph class="text-gray-400 mb-auto">
      {{ item.Nominal }} {{ baseCurrency }}
    </DefaultParagraph>
    <DefaultParagraph class="mt-3 font-semibold">
      {{ item.Value }} {{ item.CharCode }}
      <span
        class="text-gray-400 text-xs"
        :class="{
          'text-red-400': item.state === 'down',
          'text-green-400': item.state === 'up',
        }"
      >
        {{ (item.Value - item.Previous).toFixed(2) }}
        {{ item.state === "up" ? "▲" : item.state === "down" ? "▼" : "" }}
      </span>
    </DefaultParagraph>
  </router-link>
</template>

<style scoped></style>
