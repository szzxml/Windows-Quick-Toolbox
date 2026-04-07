<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from '@/components/ui/SearchBar.vue'
import { useSearch } from '@/composables/useSearch'

const router = useRouter()
const { query, results, setQuery, clear } = useSearch()

const hasResults = computed(() => results.value.length > 0)

async function handleResultClick(id: string): Promise<void> {
  const item = results.value.find((entry) => entry.id === id)
  if (!item) {
    return
  }

  if (item.type === 'route' && item.route) {
    await router.push(item.route)
  }

  if (item.type === 'tool' && item.toolId) {
    await window.api.launcher.open(item.toolId)
  }

  clear()
}

function minimizeWindow(): Promise<void> {
  return window.api.window.minimize()
}

function maximizeWindow(): Promise<boolean> {
  return window.api.window.maximize()
}

function closeWindow(): Promise<void> {
  return window.api.window.close()
}
</script>

<template>
  <header class="titlebar glass-panel">
    <div class="drag-zone">
      <div class="search-layer no-drag">
        <SearchBar :model-value="query" placeholder="搜索页面或工具，按名称直接跳转" @update:model-value="setQuery" />
        <div v-if="hasResults" class="search-results glass-panel">
          <button v-for="item in results" :key="item.id" class="result-item" type="button" @click="handleResultClick(item.id)">
            <strong>{{ item.label }}</strong>
            <span>{{ item.description }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="actions no-drag">
      <div class="window-controls" aria-label="窗口控制">
        <button class="window-control minimize" type="button" aria-label="最小化窗口" @click="minimizeWindow">
          <span class="window-control-symbol">−</span>
        </button>
        <button class="window-control maximize" type="button" aria-label="最大化窗口" @click="maximizeWindow">
          <span class="window-control-symbol">□</span>
        </button>
        <button class="window-control close" type="button" aria-label="关闭窗口" @click="closeWindow">
          <span class="window-control-symbol">×</span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.titlebar {
  position: relative;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--titlebar-height);
  padding: 0 var(--space-5);
  border-radius: 24px;
  -webkit-app-region: drag;
  overflow: visible;
}

.drag-zone {
  flex: 1;
}

.no-drag {
  -webkit-app-region: no-drag;
}

.search-layer {
  position: relative;
  width: min(620px, 100%);
}

.search-results {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  display: grid;
  gap: 6px;
  padding: var(--space-2);
  border-radius: var(--radius-md);
  z-index: 40;
}

.result-item {
  display: grid;
  gap: 2px;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  text-align: left;
  color: var(--text-primary);
  cursor: pointer;
}

.result-item:hover {
  background: var(--surface-hover);
}

.result-item span {
  color: var(--text-secondary);
  font-size: 12px;
}

.actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-left: var(--space-4);
}

.window-controls {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0 2px;
}

.window-control {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  transition:
    transform var(--transition-fast),
    box-shadow var(--transition-fast),
    background var(--transition-fast),
    filter var(--transition-fast);
}

.window-control:hover {
  transform: scale(1.06);
}

.window-control:active {
  transform: scale(0.94);
}

.window-control.close {
  background: linear-gradient(180deg, #ff8f86 0%, #ff5f57 100%);
  box-shadow: inset 0 0 0 1px rgba(173, 45, 39, 0.32);
}

.window-control.minimize {
  background: linear-gradient(180deg, #ffd966 0%, #ffbd2e 100%);
  box-shadow: inset 0 0 0 1px rgba(176, 126, 20, 0.28);
}

.window-control.maximize {
  background: linear-gradient(180deg, #54d978 0%, #28c840 100%);
  box-shadow: inset 0 0 0 1px rgba(34, 122, 50, 0.24);
}

.window-control-symbol {
  position: absolute;
  color: rgba(60, 32, 28, 0.78);
  font-size: 10px;
  line-height: 1;
  font-weight: 700;
  opacity: 0;
  transform: scale(0.85);
  transition:
    opacity var(--transition-fast),
    transform var(--transition-fast);
  pointer-events: none;
}

.window-controls:hover .window-control-symbol,
.window-control:focus-visible .window-control-symbol {
  opacity: 1;
  transform: scale(1);
}

.window-control.close:hover {
  background: linear-gradient(180deg, #ff9f98 0%, #ff3b30 100%);
  box-shadow:
    inset 0 0 0 1px rgba(163, 31, 26, 0.35),
    0 0 0 4px rgba(255, 95, 87, 0.16);
}

.window-control.minimize:hover {
  filter: saturate(1.06) brightness(1.03);
}

.window-control.maximize:hover {
  filter: saturate(1.06) brightness(1.03);
}

.window-control:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--accent) 55%, white);
  outline-offset: 3px;
}
</style>
