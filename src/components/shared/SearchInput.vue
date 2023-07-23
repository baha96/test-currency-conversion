<script setup lang="ts">
import { ref } from "vue";
const emit = defineEmits(["search:get"]);
const searchText = ref("");
let debounceTimer;
function debounceInput() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit("search:get", searchText.value.toLowerCase());
  }, 400);
}
</script>

<template>
  <div class="search-input">
    <input
      v-model.trim="searchText"
      type="text"
      placeholder="Поиск по названию или по коду"
      class="mb-10 border px-4 py-2 rounded outline-0 w-1/3"
      @input="debounceInput"
    />
  </div>
</template>
