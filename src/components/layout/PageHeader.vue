<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <header class="page-header">
    <div>
      <h1>{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
    </div>
    <div class="actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  align-items: flex-start;
}

.page-header h1 {
  margin: 0;
  font-size: 30px;
}

.page-header p {
  margin: var(--space-2) 0 0;
  color: var(--text-secondary);
}

.actions {
  display: flex;
  gap: var(--space-3);
  align-items: center;
}
</style>
