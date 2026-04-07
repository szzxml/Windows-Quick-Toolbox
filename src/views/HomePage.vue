<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import CategoryGrid from '@/components/shared/CategoryGrid.vue'
import ToolCard from '@/components/shared/ToolCard.vue'
import { useSysInfoStore } from '@/stores/sysinfo.store'
import { useToolStore } from '@/stores/tool.store'

const toolStore = useToolStore()
const sysInfoStore = useSysInfoStore()
const router = useRouter()

const overviewItems = computed(() => {
  if (!sysInfoStore.snapshot) {
    return []
  }

  const { overview, cpu, memory } = sysInfoStore.snapshot
  return [
    { label: 'CPU 实时占用', value: `${overview.cpuLoad}%`, detail: cpu.brand },
    { label: '内存负载', value: `${overview.memoryLoad}%`, detail: `${(memory.used / 1024 ** 3).toFixed(1)} GB 已用` },
    { label: '系统版本', value: overview.release, detail: overview.distro },
    { label: '主机名', value: overview.hostname, detail: overview.arch }
  ]
})
</script>

<template>
  <div class="page-shell">
    <PageHeader title="Windows Quick Toolbox" description="集中管理环境变量、系统控制台和常用 Windows 维护工具。">
      <template #actions>
        <Button variant="accent" @click="router.push('/env-var')">打开环境变量</Button>
        <Button variant="subtle" @click="router.push('/advanced/sysinfo')">查看系统仪表盘</Button>
      </template>
    </PageHeader>

    <section class="hero glass-panel">
      <div>
        <span class="eyebrow">Desktop Operations Hub</span>
        <h2>把零散的 Windows 工具集中到一个 Fluent 控制台里。</h2>
        <p class="detail-text">
          当前版本已经接通环境变量编辑、系统工具启动、Hosts 管理、临时文件清理、进程查看和网络诊断。
        </p>
      </div>
    </section>

    <section class="metric-grid">
      <Card v-for="item in overviewItems" :key="item.label">
        <p class="metric-label">{{ item.label }}</p>
        <h3>{{ item.value }}</h3>
        <span class="metric-detail">{{ item.detail }}</span>
      </Card>
    </section>

    <section>
      <div class="section-title">
        <h2>快速工具</h2>
        <Button variant="ghost" @click="router.push('/system-tools')">查看全部</Button>
      </div>
      <CategoryGrid>
        <ToolCard v-for="tool in toolStore.favorites" :key="tool.id" :tool="tool" @launch="toolStore.open" />
      </CategoryGrid>
    </section>
  </div>
</template>

<style scoped>
.hero {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-8);
  border-radius: var(--radius-lg);
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--accent) 20%, transparent), transparent 40%),
    var(--surface-2);
}

.eyebrow {
  display: inline-block;
  margin-bottom: var(--space-3);
  color: var(--accent);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  font-size: 34px;
  max-width: 720px;
}

.metric-label {
  margin: 0 0 var(--space-2);
  color: var(--text-secondary);
}

.metric-detail {
  color: var(--text-muted);
  font-size: 13px;
}

h3 {
  margin: 0 0 var(--space-2);
  font-size: 28px;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.section-title h2 {
  font-size: 22px;
}
</style>
