<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Toggle from '@/components/ui/Toggle.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import type { CleanerEntry } from '@/types/models'

const items = ref<CleanerEntry[]>([])
const selected = ref<Record<string, boolean>>({})
const scanning = ref(false)
const result = ref('')

function formatSize(bytes: number): string {
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`
}

async function scan(): Promise<void> {
  scanning.value = true
  try {
    items.value = await window.api.cleaner.scan()
    selected.value = Object.fromEntries(items.value.map((item) => [item.path, true]))
  } finally {
    scanning.value = false
  }
}

async function clean(): Promise<void> {
  const paths = items.value.filter((item) => selected.value[item.path]).map((item) => item.path)
  const summary = await window.api.cleaner.clean(paths)
  result.value = `删除 ${summary.deleted} 个文件，释放 ${formatSize(summary.freed)}`
  await scan()
}

onMounted(scan)
</script>

<template>
  <div class="page-shell">
    <PageHeader title="临时文件清理" description="扫描常见 Temp 目录，支持按目录勾选清理。">
      <template #actions>
        <Button variant="subtle" @click="scan">{{ scanning ? '扫描中...' : '重新扫描' }}</Button>
        <Button variant="accent" @click="clean">开始清理</Button>
      </template>
    </PageHeader>

    <div class="page-grid">
      <Card v-for="item in items" :key="item.path">
        <div class="clean-row">
          <div>
            <h3>{{ item.path }}</h3>
            <p class="detail-text">{{ item.files }} 个文件，约 {{ formatSize(item.size) }}</p>
          </div>
          <Toggle v-model="selected[item.path]" />
        </div>
      </Card>
    </div>

    <Card v-if="result">
      <p>{{ result }}</p>
    </Card>
  </div>
</template>

<style scoped>
.clean-row {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  align-items: center;
}

h3 {
  margin: 0 0 var(--space-2);
  font-size: 15px;
  word-break: break-all;
}
</style>
