<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="overlay" @click.self="emit('close')">
      <div class="panel glass-panel">
        <div class="header">
          <h3>{{ title }}</h3>
          <button class="close" type="button" @click="emit('close')">X</button>
        </div>
        <div class="body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(15, 18, 23, 0.32);
  z-index: 60;
}

.panel {
  width: min(560px, calc(100vw - 32px));
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.header h3 {
  margin: 0;
  font-size: 20px;
}

.body {
  display: grid;
  gap: var(--space-4);
}

.close {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  color: var(--text-secondary);
  cursor: pointer;
}
</style>
