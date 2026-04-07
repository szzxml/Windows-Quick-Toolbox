<script setup lang="ts">
const tabs = [
  { label: 'Hosts', path: '/advanced/hosts' },
  { label: '系统信息', path: '/advanced/sysinfo' },
  { label: '临时清理', path: '/advanced/cleaner' },
  { label: '进程管理', path: '/advanced/process' },
  { label: '网络工具', path: '/advanced/network' }
]
</script>

<template>
  <div class="page-shell">
    <div class="tabbar glass-panel">
      <RouterLink v-for="tab in tabs" :key="tab.path" :to="tab.path" class="tab">
        {{ tab.label }}
      </RouterLink>
    </div>
    <RouterView />
  </div>
</template>

<style scoped>
.tabbar {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-2);
  border-radius: var(--radius-md);
}

.tab {
  padding: 10px 16px;
  border-radius: 999px;
  color: var(--text-secondary);
}

.tab.router-link-active {
  background: var(--surface-hover);
  color: var(--text-primary);
}
</style>
