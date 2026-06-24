<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const collectors = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await axios.get('/api/workflows')
    collectors.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

const showCreateModal = ref(false)
const newName = ref('')
const newCron = ref('')
const newDesc = ref('')

async function createCollector() {
  if (!newName.value.trim()) return
  try {
    await axios.post('/api/workflows', {
      name: newName.value.trim(),
      description: newDesc.value.trim(),
      cron_expression: newCron.value.trim() || null,
      nodes_config: {}
    })
    showCreateModal.value = false
    newName.value = ''
    newCron.value = ''
    newDesc.value = ''
    // Refresh list
    const res = await axios.get('/api/workflows')
    collectors.value = res.data
  } catch (err) {
    console.error(err)
    alert('建立失敗')
  }
}
</script>

<template>
  <div class="collectors-page">
    <div class="page-header">
      <div>
        <h2>Data Collectors</h2>
        <p class="subtitle">Configure automated data collection tasks.</p>
      </div>
      <button class="btn btn-accent" @click="showCreateModal = true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New Collector
      </button>
    </div>

    <div v-if="loading" class="empty-state glass">Loading collectors...</div>

    <div v-else-if="collectors.length === 0" class="empty-state glass">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1" style="color: var(--text-muted); margin-bottom: 12px;"><path d="M12 12l4-4"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="10"/></svg>
      <p>No collectors configured yet.</p>
      <button class="btn btn-accent" style="margin-top: 16px;" @click="showCreateModal = true">Create your first collector</button>
    </div>

    <div v-else class="collector-grid">
      <div v-for="c in collectors" :key="c.id" class="collector-card glass hover-lift">
        <div class="card-top">
          <div class="card-icon" :class="c.is_active ? 'active' : 'inactive'">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 12l4-4"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="10"/></svg>
          </div>
          <span class="card-badge" :class="c.is_active ? 'active' : 'inactive'">
            {{ c.is_active ? 'Active' : 'Paused' }}
          </span>
        </div>
        <h3 class="card-name">{{ c.name }}</h3>
        <p class="card-desc">{{ c.description || 'No description' }}</p>
        <div class="card-meta">
          <span>Cron: {{ c.cron_expression || '—' }}</span>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
        <div class="modal glass">
          <h3>New Data Collector</h3>
          <div class="form-group">
            <label>Name</label>
            <input v-model="newName" placeholder="e.g. Price Tracker" />
          </div>
          <div class="form-group">
            <label>Description</label>
            <input v-model="newDesc" placeholder="What data does this collect?" />
          </div>
          <div class="form-group">
            <label>Cron Expression</label>
            <input v-model="newCron" placeholder="e.g. */30 * * * * (every 30 min)" />
          </div>
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="showCreateModal = false">Cancel</button>
            <button class="btn btn-accent" @click="createCollector">Create</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.collectors-page { display: flex; flex-direction: column; gap: 20px; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.page-header h2 { font-size: 1.4rem; font-weight: 700; }
.subtitle { color: var(--text-muted); font-size: 0.875rem; margin-top: 4px; }

.collector-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.collector-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: default;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-icon {
  width: 36px; height: 36px;
  border-radius: var(--radius-sm);
  display: flex; align-items: center; justify-content: center;
}
.card-icon.active  { background: rgba(167,139,250,0.12); color: var(--accent); }
.card-icon.inactive { background: var(--bg-tertiary); color: var(--text-muted); }

.card-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.card-badge.active { background: rgba(52,211,153,0.12); color: var(--success); }
.card-badge.inactive { background: var(--bg-tertiary); color: var(--text-muted); }

.card-name { font-size: 1rem; font-weight: 600; }
.card-desc { font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; }
.card-meta { font-size: 0.75rem; color: var(--text-muted); margin-top: auto; }

.empty-state {
  text-align: center;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-muted);
}

/* ── Modal ── */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.15s ease;
}
@keyframes fadeIn { from { opacity: 0; } }

.modal {
  width: 420px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.modal h3 { font-size: 1.1rem; font-weight: 600; }

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}
.form-group input {
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s ease;
}
.form-group input:focus { border-color: var(--accent); }
.form-group input::placeholder { color: var(--text-muted); }

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
