<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import TitleBar from '@/components/layout/TitleBar.vue'
import { useSearchStore } from '@/stores/search.store'
import { useSysInfoStore } from '@/stores/sysinfo.store'
import { useThemeStore } from '@/stores/theme.store'
import { useToolStore } from '@/stores/tool.store'

const themeStore = useThemeStore()
const toolStore = useToolStore()
const searchStore = useSearchStore()
const sysInfoStore = useSysInfoStore()

onMounted(async () => {
  await Promise.all([themeStore.init(), toolStore.load(), searchStore.init(), sysInfoStore.init()])
})

onBeforeUnmount(() => {
  themeStore.dispose()
  sysInfoStore.dispose()
})
</script>

<template>
  <div class="app-shell">
    <Sidebar />
    <div class="content-shell">
      <TitleBar />
      <main class="content glass-panel">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
  gap: 12px;
  height: 100vh;
  padding: 12px;
  overflow: hidden;
}

.content-shell {
  display: grid;
  grid-template-rows: var(--titlebar-height) minmax(0, 1fr);
  gap: 12px;
  min-width: 0;
  min-height: 0;
}

.content {
  min-height: 0;
  padding: var(--space-8);
  border-radius: 28px;
  overflow: auto;
  overscroll-behavior: contain;
}
</style>
