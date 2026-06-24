<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const logs = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await axios.get('/api/executions?limit=50')
    logs.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

function statusClass(status: string) {
  if (status === 'SUCCESS') return 'success'
  if (status === 'FAILED') return 'danger'
  if (status === 'RUNNING') return 'warning'
  return 'muted'
}

function statusText(status: string) {
  const map: Record<string, string> = {
    'SUCCESS': '成功', 'FAILED': '失敗', 'RUNNING': '執行中', 'PENDING': '等待中', 'MISSED': '錯過'
  }
  return map[status] || status
}
</script>

<template>
  <div class="data-page">
    <div class="page-header">
      <div>
        <h2>資料瀏覽</h2>
        <p class="subtitle">瀏覽所有收集的資料及執行紀錄。</p>
      </div>
    </div>

    <div v-if="loading" class="empty-state glass">載入資料中...</div>

    <div v-else-if="logs.length === 0" class="empty-state glass">
      <p>找不到執行資料。請執行收集器以開始收集資料。</p>
    </div>

    <div v-else class="table-wrapper glass">
      <table class="data-table">
        <thead>
          <tr>
            <th>狀態</th>
            <th>收集器</th>
            <th>觸發時間</th>
            <th>完成時間</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td>
              <span class="status-pill" :class="statusClass(log.status)">{{ statusText(log.status) }}</span>
            </td>
            <td class="cell-name">{{ log.workflow?.name || '—' }}</td>
            <td class="cell-time">{{ new Date(log.trigger_time).toLocaleString('zh-TW') }}</td>
            <td class="cell-time">{{ log.completed_at ? new Date(log.completed_at).toLocaleString('zh-TW') : '—' }}</td>
            <td class="cell-id">{{ log.id.slice(0, 8) }}…</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.data-page { display: flex; flex-direction: column; gap: 20px; }

.page-header h2 { font-size: 1.4rem; font-weight: 700; }
.subtitle { color: var(--text-muted); font-size: 0.875rem; margin-top: 4px; }

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--text-muted);
}

.table-wrapper {
  overflow: auto;
  padding: 4px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}
.data-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border);
}
.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  color: var(--text-secondary);
  transition: background 0.15s ease;
}
.data-table tr:hover td { background: var(--bg-tertiary); }

.cell-name { color: var(--text-primary); font-weight: 500; }
.cell-time { font-size: 0.8rem; }
.cell-id { font-family: monospace; font-size: 0.75rem; color: var(--text-muted); }

.status-pill {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.status-pill.success { background: rgba(52,211,153,0.12); color: var(--success); }
.status-pill.danger  { background: rgba(248,113,113,0.12); color: var(--danger); }
.status-pill.warning { background: rgba(251,191,36,0.12);  color: var(--warning); }
.status-pill.muted   { background: var(--bg-tertiary);      color: var(--text-muted); }
</style>
