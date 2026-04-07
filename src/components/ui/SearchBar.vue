<script setup lang="ts">
import Input from './Input.vue'

defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="search-shell">
    <span class="search-icon">🔎</span>
    <Input :model-value="modelValue" :placeholder="placeholder" @update:model-value="emit('update:modelValue', $event)" />
  </div>
</template>

<style scoped>
.search-shell {
  position: relative;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1;
  z-index: 1;
  pointer-events: none;
}

.search-shell :deep(.input) {
  padding-left: 36px;
}
</style>
