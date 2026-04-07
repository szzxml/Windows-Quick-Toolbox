<script setup lang="ts">
import { onMounted } from 'vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { useProcessStore } from '@/stores/process.store'

const store = useProcessStore()

onMounted(() => {
  store.refresh()
})
</script>

<template>
  <div class="page-shell">
    <PageHeader title="进程管理" description="按 CPU 使用率排序当前进程，可直接结束指定进程。">
      <template #actions>
        <Button variant="subtle" @click="store.refresh">{{ store.loading ? '刷新中...' : '刷新' }}</Button>
      </template>
    </PageHeader>

    <Card>
      <table class="table">
        <thead>
          <tr>
            <th>进程</th>
            <th>PID</th>
            <th>CPU</th>
            <th>内存</th>
            <th>用户</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in store.items.slice(0, 24)" :key="item.pid">
            <td>{{ item.name }}</td>
            <td>{{ item.pid }}</td>
            <td>{{ item.cpu.toFixed(1) }}%</td>
            <td>{{ item.mem.toFixed(1) }}%</td>
            <td>{{ item.user }}</td>
            <td>
              <Button size="sm" variant="danger" @click="store.kill(item.pid)">结束</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: var(--stroke-soft);
}

th {
  color: var(--text-secondary);
  font-weight: 600;
}
</style>
