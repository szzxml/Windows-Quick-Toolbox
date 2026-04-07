<script setup lang="ts">
withDefaults(
  defineProps<{
    hoverable?: boolean
    clickable?: boolean
  }>(),
  {
    hoverable: false,
    clickable: false
  }
)
</script>

<template>
  <div class="tool-card" :class="{ hoverable, clickable }">
    <slot />
  </div>
</template>

<style scoped>
.tool-card {
  background: var(--surface-2);
  border: var(--stroke-soft);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--space-5);
  transition:
    transform var(--transition-fast),
    border-color var(--transition-fast),
    background var(--transition-fast);
}

.tool-card.hoverable:hover,
.tool-card.clickable:hover {
  transform: translateY(-2px);
  border-color: var(--border-strong);
}

.tool-card.clickable {
  cursor: pointer;
}
</style>
