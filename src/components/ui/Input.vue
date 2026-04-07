<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <input
    class="input"
    :value="modelValue"
    :placeholder="placeholder"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<style scoped>
.input {
  width: 100%;
  min-height: 40px;
  padding: 0 var(--space-4);
  border-radius: var(--radius-sm);
  border: var(--stroke-soft);
  outline: none;
  background: var(--surface-3);
  color: var(--text-primary);
  transition:
    border-color var(--transition-fast),
    background var(--transition-fast);
}

.input:focus {
  border-color: var(--accent);
}
</style>
