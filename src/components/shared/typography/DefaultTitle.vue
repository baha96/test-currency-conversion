<script setup lang="ts">
interface IPropsData {
  tag: string;
}
defineProps<IPropsData>();
</script>

<template>
  <component :is="tag" class="default-title font-bold"><slot></slot></component>
</template>
