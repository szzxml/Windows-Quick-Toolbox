<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import PageHeader from '@/components/layout/PageHeader.vue'

const output = ref('')
const busy = ref(false)

async function flushDns(): Promise<void> {
  busy.value = true
  try {
    output.value = await window.api.network.flushDns()
  } finally {
    busy.value = false
  }
}

async function readIpConfig(): Promise<void> {
  busy.value = true
  try {
    output.value = await window.api.network.getIpConfig()
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="page-shell">
    <PageHeader title="网络工具" description="执行 DNS 刷新并输出完整的 ipconfig /all 信息。">
      <template #actions>
        <Button variant="subtle" @click="flushDns">{{ busy ? '执行中...' : '刷新 DNS' }}</Button>
        <Button variant="accent" @click="readIpConfig">读取 IP 配置</Button>
      </template>
    </PageHeader>
    <Card>
      <pre class="mono-block">{{ output || '点击上方按钮执行网络诊断。' }}</pre>
    </Card>
  </div>
</template>
