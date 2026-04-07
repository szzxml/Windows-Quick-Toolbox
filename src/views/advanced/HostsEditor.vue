<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import PageHeader from '@/components/layout/PageHeader.vue'

const content = ref('')
const loading = ref(false)
const saving = ref(false)

async function load(): Promise<void> {
  loading.value = true
  try {
    content.value = await window.api.hosts.read()
  } finally {
    loading.value = false
  }
}

async function save(): Promise<void> {
  saving.value = true
  try {
    await window.api.hosts.write(content.value)
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="page-shell">
    <PageHeader title="Hosts 编辑器" description="直接查看和保存系统 hosts 文件，保存时会触发管理员授权。">
      <template #actions>
        <Button variant="subtle" @click="load">刷新</Button>
        <Button variant="accent" @click="save">{{ saving ? '保存中...' : '保存' }}</Button>
      </template>
    </PageHeader>
    <Card>
      <textarea v-model="content" class="editor" rows="20" :disabled="loading" />
    </Card>
  </div>
</template>

<style scoped>
.editor {
  width: 100%;
  min-height: 520px;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--text-primary);
  font-family: Consolas, "Courier New", monospace;
  line-height: 1.6;
}
</style>
