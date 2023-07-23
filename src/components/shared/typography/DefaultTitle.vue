<script setup lang="ts">
interface IPropsData {
  tag: string;
}
defineProps<IPropsData>();
</script>

<template>
  <component :is="tag" class="default-title"><slot></slot></component>
</template>
