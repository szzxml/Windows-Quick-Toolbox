<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <span class="tooltip" :title="text">
    <slot />
  </span>
</template>

<style scoped>
.tooltip {
  display: inline-flex;
}
</style>
