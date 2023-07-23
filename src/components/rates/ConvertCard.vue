<script setup lang="ts">
import DefaultTitle from "../shared/typography/DefaultTitle.vue";
import SwitcherCurrency from "./SwitcherCurrency.vue";
defineProps<{
  isDisabled?: boolean;
  title: string;
  value: string;
  currency: string;
}>();
const emit = defineEmits(["change:input", "change:currency"]);
</script>

<template>
  <div class="convert-block flex items-center shadow-xl p-8 rounded">
    <DefaultTitle tag="h2" class="text-3xl">{{ title }}</DefaultTitle>
    <input
      class="mx-8 border outline-0 px-6 py-4 rounded"
      type="text"
      :value="value"
      @input="emit('change:input', $event.target.value)"
      :disabled="isDisabled"
    />
    <SwitcherCurrency
      :isGlobalChange="false"
      @get:currency="emit('change:currency', $event)"
      :baseCurrency="currency"
    />
  </div>
</template>
