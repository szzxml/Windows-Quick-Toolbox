<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <button class="toggle" :class="{ active: modelValue }" type="button" @click="emit('update:modelValue', !modelValue)">
    <span class="thumb" />
  </button>
</template>

<style scoped>
.toggle {
  position: relative;
  width: 48px;
  height: 28px;
  border-radius: 999px;
  background: var(--surface-3);
  border: var(--stroke-soft);
  cursor: pointer;
}

.toggle.active {
  background: var(--accent);
}

.thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  transition: transform var(--transition-fast);
}

.toggle.active .thumb {
  transform: translateX(20px);
}
</style>
