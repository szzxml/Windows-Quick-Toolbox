<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'accent' | 'warning' | 'danger' | 'neutral'
  }>(),
  {
    tone: 'neutral'
  }
)
</script>

<template>
  <span class="badge" :class="tone">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.badge.accent {
  background: var(--accent-soft);
  color: var(--accent);
}

.badge.warning {
  background: color-mix(in srgb, var(--warning) 18%, transparent);
  color: var(--warning);
}

.badge.danger {
  background: color-mix(in srgb, var(--danger) 18%, transparent);
  color: var(--danger);
}

.badge.neutral {
  background: var(--surface-3);
  color: var(--text-secondary);
}
</style>
