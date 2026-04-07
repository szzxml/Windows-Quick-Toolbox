<script setup lang="ts">
import { computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { useSysInfoStore } from '@/stores/sysinfo.store'

const store = useSysInfoStore()

const disks = computed(() => store.snapshot?.disks ?? [])
</script>

<template>
  <div class="page-shell">
    <PageHeader title="系统信息仪表盘" description="查看 CPU、内存和磁盘占用概览，主界面每 3 秒更新一次。" />
    <div class="metric-grid">
      <Card>
        <p class="detail-text">CPU</p>
        <h3>{{ store.snapshot?.overview.cpuLoad ?? 0 }}%</h3>
        <span class="detail-text">{{ store.snapshot?.cpu.brand }}</span>
      </Card>
      <Card>
        <p class="detail-text">内存</p>
        <h3>{{ store.snapshot?.overview.memoryLoad ?? 0 }}%</h3>
        <span class="detail-text">{{ ((store.snapshot?.memory.total ?? 0) / 1024 ** 3).toFixed(1) }} GB 总计</span>
      </Card>
      <Card>
        <p class="detail-text">系统</p>
        <h3>{{ store.snapshot?.overview.release }}</h3>
        <span class="detail-text">{{ store.snapshot?.overview.distro }}</span>
      </Card>
    </div>

    <div class="page-grid">
      <Card v-for="disk in disks" :key="disk.fs">
        <h3>{{ disk.fs || disk.mount }}</h3>
        <p class="detail-text">已用 {{ ((disk.used / disk.size) * 100 || 0).toFixed(1) }}%</p>
        <div class="bar">
          <span :style="{ width: `${((disk.used / disk.size) * 100 || 0).toFixed(1)}%` }" />
        </div>
        <p class="detail-text">剩余 {{ (disk.available / 1024 ** 3).toFixed(1) }} GB</p>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.bar {
  height: 10px;
  border-radius: 999px;
  background: var(--surface-3);
  overflow: hidden;
}

.bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent), var(--accent-strong));
}

h3 {
  margin: 0 0 var(--space-3);
}
</style>
