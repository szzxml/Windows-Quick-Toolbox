<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import SearchBar from '@/components/ui/SearchBar.vue'
import Badge from '@/components/ui/Badge.vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import { useElevation } from '@/composables/useElevation'
import { useEnvVarStore } from '@/stores/env-var.store'

const store = useEnvVarStore()
const dialogOpen = ref(false)
const editingOriginalName = ref('')
const form = reactive({
  name: '',
  value: ''
})

const pathSelected = computed(() => store.selectedVariable?.name.toUpperCase() === 'PATH')
const { requiresElevation } = useElevation(() => store.scope)

onMounted(() => {
  store.load()
})

function openCreate(): void {
  editingOriginalName.value = ''
  form.name = ''
  form.value = ''
  dialogOpen.value = true
}

function openEdit(): void {
  if (!store.selectedVariable) {
    return
  }

  editingOriginalName.value = store.selectedVariable.name
  form.name = store.selectedVariable.name
  form.value = store.selectedVariable.value
  dialogOpen.value = true
}

async function submit(): Promise<void> {
  await store.saveVariable(form.name, form.value, editingOriginalName.value || undefined)
  dialogOpen.value = false
}

function select(name: string): void {
  store.selectedName = name
}

function movePath(index: number, direction: -1 | 1): void {
  const nextIndex = index + direction
  if (nextIndex < 0 || nextIndex >= store.pathDraft.length) {
    return
  }

  const list = [...store.pathDraft]
  ;[list[index], list[nextIndex]] = [list[nextIndex], list[index]]
  store.pathDraft = list
}
</script>

<template>
  <div class="page-shell">
    <PageHeader title="环境变量管理" description="查看和编辑当前用户与系统环境变量，包含 PATH 可视化编辑。">
      <template #actions>
        <Button variant="accent" @click="openCreate">新增变量</Button>
        <Button variant="subtle" @click="store.load(store.scope)">刷新</Button>
      </template>
    </PageHeader>

    <div class="scope-row">
      <Button :variant="store.scope === 'user' ? 'accent' : 'subtle'" @click="store.load('user')">用户变量</Button>
      <Button :variant="store.scope === 'system' ? 'accent' : 'subtle'" @click="store.load('system')">系统变量</Button>
      <Badge v-if="requiresElevation" tone="warning">系统变量写入需要管理员授权</Badge>
    </div>

    <div class="env-layout">
      <Card>
        <div class="left-head">
          <SearchBar :model-value="store.search" placeholder="搜索变量名或值" @update:model-value="store.search = $event" />
        </div>
        <div class="env-list">
          <button
            v-for="item in store.filtered"
            :key="item.name"
            class="env-item"
            :class="{ active: store.selectedVariable?.name === item.name }"
            type="button"
            @click="select(item.name)"
          >
            <strong>{{ item.name }}</strong>
            <span>{{ item.value }}</span>
          </button>
        </div>
      </Card>

      <Card>
        <template v-if="store.selectedVariable">
          <div class="detail-head">
            <div>
              <h3>{{ store.selectedVariable.name }}</h3>
              <p class="detail-text">{{ store.selectedVariable.type }} / {{ store.scope }}</p>
            </div>
            <div class="detail-actions">
              <Button variant="subtle" @click="openEdit">编辑</Button>
              <Button variant="danger" @click="store.removeVariable(store.selectedVariable.name)">删除</Button>
            </div>
          </div>

          <div class="mono-block">{{ store.selectedVariable.value }}</div>

          <section v-if="pathSelected" class="path-editor">
            <div class="section-inline">
              <h4>PATH 可视化编辑</h4>
              <Button variant="accent" size="sm" @click="store.savePath">保存 PATH</Button>
            </div>
            <div class="path-list">
              <div v-for="(entry, index) in store.pathDraft" :key="`${index}-${entry}`" class="path-item">
                <Input v-model="store.pathDraft[index]" placeholder="输入目录路径" />
                <div class="path-actions">
                  <Button size="sm" variant="ghost" @click="movePath(index, -1)">Up</Button>
                  <Button size="sm" variant="ghost" @click="movePath(index, 1)">Dn</Button>
                  <Button size="sm" variant="danger" @click="store.pathDraft.splice(index, 1)">删</Button>
                </div>
              </div>
            </div>
            <Button variant="subtle" @click="store.pathDraft.push('')">添加 PATH 项</Button>
          </section>
        </template>

        <p v-else class="detail-text">当前范围没有变量，或者搜索结果为空。</p>
      </Card>
    </div>

    <Modal :open="dialogOpen" :title="editingOriginalName ? '编辑变量' : '新增变量'" @close="dialogOpen = false">
      <label>
        <span class="field-label">变量名</span>
        <Input v-model="form.name" placeholder="例如 JAVA_HOME" />
      </label>
      <label>
        <span class="field-label">变量值</span>
        <textarea v-model="form.value" class="textarea" rows="7" placeholder="输入变量值" />
      </label>
      <div class="dialog-actions">
        <Button variant="subtle" @click="dialogOpen = false">取消</Button>
        <Button variant="accent" @click="submit">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<style scoped>
.scope-row {
  display: flex;
  gap: var(--space-3);
  align-items: center;
}

.env-layout {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: minmax(320px, 380px) minmax(0, 1fr);
}

.env-list {
  display: grid;
  gap: var(--space-2);
  max-height: 620px;
  overflow: auto;
}

.left-head {
  margin-bottom: var(--space-4);
}

.env-item {
  display: grid;
  gap: 4px;
  padding: var(--space-4);
  border-radius: var(--radius-sm);
  text-align: left;
  cursor: pointer;
  background: transparent;
}

.env-item:hover,
.env-item.active {
  background: var(--surface-hover);
}

.env-item span {
  color: var(--text-muted);
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-head,
.section-inline,
.path-item,
.dialog-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.detail-head {
  margin-bottom: var(--space-4);
}

.detail-actions {
  display: flex;
  gap: var(--space-3);
}

.path-editor {
  margin-top: var(--space-5);
  display: grid;
  gap: var(--space-4);
}

.path-list {
  display: grid;
  gap: var(--space-3);
}

.path-item {
  align-items: stretch;
}

.path-actions {
  display: flex;
  gap: var(--space-2);
}

.textarea {
  width: 100%;
  border-radius: var(--radius-sm);
  border: var(--stroke-soft);
  padding: var(--space-4);
  background: var(--surface-3);
  color: var(--text-primary);
}

.field-label {
  display: block;
  margin-bottom: var(--space-2);
  color: var(--text-secondary);
}
</style>
