<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const stats = ref({
  totalWorkflows: 0,
  activeWorkflows: 0,
  totalExecutions: 0,
  successExecutions: 0,
  failedExecutions: 0,
  successRate: '0'
})

const recentLogs = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [statsRes, logsRes] = await Promise.all([
      axios.get('/api/stats'),
      axios.get('/api/executions?limit=10')
    ])
    stats.value = statsRes.data
    recentLogs.value = logsRes.data
  } catch (err) {
    console.error('無法取得儀表板資料:', err)
  } finally {
    loading.value = false
  }
})

function statusColor(status: string) {
  if (status === 'SUCCESS') return 'var(--success)'
  if (status === 'FAILED') return 'var(--danger)'
  if (status === 'RUNNING') return 'var(--warning)'
  return 'var(--text-muted)'
}

function statusText(status: string) {
  const map: Record<string, string> = {
    'SUCCESS': '成功', 'FAILED': '失敗', 'RUNNING': '執行中', 'PENDING': '等待中', 'MISSED': '錯過'
  }
  return map[status] || status
}
</script>

<template>
  <div class="overview">
    <!-- KPI 卡片 -->
    <div class="kpi-row">
      <div class="kpi glass hover-lift">
        <div class="kpi-icon purple">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 12l4-4"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="10"/></svg>
        </div>
        <div class="kpi-body">
          <span class="kpi-label">啟用中收集器</span>
          <span class="kpi-value">{{ stats.activeWorkflows }}</span>
        </div>
      </div>

      <div class="kpi glass hover-lift">
        <div class="kpi-icon green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div class="kpi-body">
          <span class="kpi-label">總執行次數</span>
          <span class="kpi-value">{{ stats.totalExecutions }}</span>
        </div>
      </div>

      <div class="kpi glass hover-lift">
        <div class="kpi-icon emerald">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div class="kpi-body">
          <span class="kpi-label">成功率</span>
          <span class="kpi-value">{{ stats.successRate }}%</span>
        </div>
      </div>

      <div class="kpi glass hover-lift">
        <div class="kpi-icon rose">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div class="kpi-body">
          <span class="kpi-label">失敗次數</span>
          <span class="kpi-value">{{ stats.failedExecutions }}</span>
        </div>
      </div>
    </div>

    <!-- 主要區塊 -->
    <div class="grid-2col">
      <div class="panel glass">
        <h3 class="panel-title">最近收集活動</h3>
        <div v-if="loading" class="empty">載入中…</div>
        <div v-else-if="recentLogs.length === 0" class="empty">
          <p>尚無收集紀錄。</p>
          <router-link to="/collectors" class="btn btn-accent" style="margin-top: 12px;">
            建立收集器
          </router-link>
        </div>
        <div v-else class="log-list">
          <div v-for="log in recentLogs" :key="log.id" class="log-row">
            <span class="log-dot" :style="{ background: statusColor(log.status) }"></span>
            <span class="log-name">{{ log.workflow?.name || '未知' }}</span>
            <span class="log-status" :style="{ color: statusColor(log.status) }">{{ statusText(log.status) }}</span>
            <span class="log-time">{{ new Date(log.created_at).toLocaleString('zh-TW') }}</span>
          </div>
        </div>
      </div>

      <div class="panel glass">
        <h3 class="panel-title">系統概況</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">收集器總數</span>
            <span class="info-value">{{ stats.totalWorkflows }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">啟用中</span>
            <span class="info-value accent">{{ stats.activeWorkflows }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">成功次數</span>
            <span class="info-value green">{{ stats.successExecutions }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">失敗次數</span>
            <span class="info-value rose">{{ stats.failedExecutions }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overview {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.kpi-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
.kpi {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}
.kpi-icon {
  width: 44px; height: 44px;
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.kpi-icon svg { width: 22px; height: 22px; }
.kpi-icon.purple  { background: rgba(167,139,250,0.12); color: #a78bfa; }
.kpi-icon.green   { background: rgba(52,211,153,0.12);  color: #34d399; }
.kpi-icon.emerald { background: rgba(16,185,129,0.12);  color: #10b981; }
.kpi-icon.rose    { background: rgba(248,113,113,0.12); color: #f87171; }

.kpi-body { display: flex; flex-direction: column; gap: 4px; }
.kpi-label { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
.kpi-value { font-size: 1.6rem; font-weight: 700; }

.grid-2col {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}
@media (max-width: 900px) {
  .grid-2col { grid-template-columns: 1fr; }
}

.panel {
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.panel-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-secondary);
}

.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.log-list { display: flex; flex-direction: column; gap: 2px; }
.log-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
  transition: background 0.15s ease;
}
.log-row:hover { background: var(--bg-tertiary); }
.log-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.log-name { flex: 1; color: var(--text-primary); font-weight: 500; }
.log-status { width: 60px; font-weight: 600; font-size: 0.75rem; }
.log-time { color: var(--text-muted); font-size: 0.75rem; }

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
}
.info-label { font-size: 0.75rem; color: var(--text-muted); }
.info-value { font-size: 1.5rem; font-weight: 700; }
.info-value.accent { color: var(--accent); }
.info-value.green  { color: var(--success); }
.info-value.rose   { color: var(--danger); }
</style>
