<script setup lang="ts">
const items = [
  { label: '首页', path: '/', icon: '🏠' },
  { label: '环境变量', path: '/env-var', icon: '🧩' },
  { label: '系统工具', path: '/system-tools', icon: '🛠️' },
  { label: '控制面板', path: '/control-panel', icon: '🎛️' },
  { label: '高级工具', path: '/advanced/hosts', icon: '⚙️' },
  { label: '设置', path: '/settings', icon: '🔧' }
]
</script>

<template>
  <aside class="sidebar glass-panel">
    <div class="brand">
      <div class="brand-mark">WT</div>
      <div>
        <strong>Windows Quick Toolbox</strong>
        <span>Fluent utility desk</span>
      </div>
    </div>

    <nav class="nav">
      <RouterLink v-for="item in items" :key="item.path" :to="item.path" class="nav-item">
        <span class="nav-icon">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  height: calc(100vh - 24px);
  padding: var(--space-6);
  border-radius: 28px;
  display: grid;
  align-content: start;
  gap: var(--space-8);
}

.brand {
  display: flex;
  gap: var(--space-4);
  align-items: center;
}

.brand strong,
.brand span {
  display: block;
}

.brand span {
  margin-top: var(--space-1);
  color: var(--text-muted);
  font-size: 12px;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-strong) 100%);
  color: white;
  font-weight: 700;
}

.nav {
  display: grid;
  gap: var(--space-2);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: 48px;
  padding: 0 var(--space-4);
  border-radius: 16px;
  color: var(--text-secondary);
  transition:
    background var(--transition-fast),
    color var(--transition-fast);
}

.nav-item:hover,
.nav-item.router-link-active {
  background: var(--surface-hover);
  color: var(--text-primary);
}

.nav-icon {
  width: 24px;
  text-align: center;
  font-size: 17px;
  line-height: 1;
}
</style>
