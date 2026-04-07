<script setup lang="ts">
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import type { SystemTool } from '@/types/models'

defineProps<{
  tool: SystemTool
}>()

const emit = defineEmits<{
  launch: [toolId: string]
}>()

const iconMap: Record<string, string> = {
  chip: '💾',
  layers: '🗂️',
  disk: '🧱',
  desktop: '🖥️',
  pulse: '📈',
  info: '📋',
  network: '🌐',
  shield: '🛡️',
  refresh: '🔄',
  bolt: '⚡',
  apps: '📦',
  settings: '🔧',
  braces: '🧬',
  tasks: '📊',
  terminal: '⌨️'
}
</script>

<template>
  <Card hoverable>
    <div class="header">
      <div class="icon">{{ iconMap[tool.icon] ?? '🧰' }}</div>
      <Badge v-if="tool.elevated" tone="warning">管理员</Badge>
    </div>
    <h3>{{ tool.name }}</h3>
    <p>{{ tool.description }}</p>
    <Button variant="accent" block @click="emit('launch', tool.id)">启动</Button>
  </Card>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 20px;
}

h3 {
  margin: 0 0 var(--space-2);
  font-size: 18px;
}

p {
  margin: 0 0 var(--space-5);
  color: var(--text-secondary);
  line-height: 1.6;
  min-height: 52px;
}
</style>
