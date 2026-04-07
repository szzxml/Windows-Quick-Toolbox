<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'accent' | 'subtle' | 'danger' | 'ghost'
    size?: 'sm' | 'md'
    block?: boolean
    nativeType?: 'button' | 'submit'
  }>(),
  {
    variant: 'subtle',
    size: 'md',
    block: false,
    nativeType: 'button'
  }
)
</script>

<template>
  <button class="button" :class="[variant, size, { block }]" :type="nativeType">
    <slot />
  </button>
</template>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 38px;
  padding: 0 var(--space-4);
  border-radius: 999px;
  border: var(--stroke-soft);
  cursor: pointer;
  transition:
    transform var(--transition-fast),
    background var(--transition-fast),
    border-color var(--transition-fast);
}

.button:hover {
  transform: translateY(-1px);
}

.button.block {
  width: 100%;
}

.button.sm {
  min-height: 30px;
  padding: 0 var(--space-3);
  font-size: 12px;
}

.button.accent {
  background: var(--accent);
  color: white;
  border-color: transparent;
}

.button.subtle {
  background: var(--surface-3);
  color: var(--text-primary);
}

.button.danger {
  background: color-mix(in srgb, var(--danger) 18%, transparent);
  color: var(--danger);
}

.button.ghost {
  background: transparent;
  color: var(--text-secondary);
}
</style>
