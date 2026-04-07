<script setup lang="ts">
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { useTheme } from '@/composables/useTheme'

const { mode, setMode } = useTheme()
</script>

<template>
  <div class="page-shell">
    <PageHeader title="设置" description="切换应用主题，查看当前版本的实现范围。" />

    <div class="page-grid">
      <Card>
        <h3>主题</h3>
        <p class="detail-text">当前模式: {{ mode }}</p>
        <div class="actions">
          <Button variant="subtle" @click="setMode('system')">跟随系统</Button>
          <Button variant="subtle" @click="setMode('light')">浅色</Button>
          <Button variant="subtle" @click="setMode('dark')">深色</Button>
        </div>
      </Card>

      <Card>
        <h3>关于</h3>
        <p class="detail-text">
          Windows Quick Toolbox 首版包含 Electron 主进程服务、Vue 路由页面和 Windows API 桥接。
        </p>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  gap: var(--space-3);
}

h3 {
  margin-top: 0;
}
</style>
