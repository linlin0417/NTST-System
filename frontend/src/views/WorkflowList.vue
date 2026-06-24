<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const workflows = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await axios.get('/api/workflows')
    workflows.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

function createNew() {
  router.push('/workflows/new')
}

function openEditor(id: number | string) {
  router.push(`/workflows/${id}`)
}
</script>

<template>
  <div class="page-container">
    <div class="header-row">
      <div>
        <h1>Workflows</h1>
        <p>Manage and monitor your automated processes.</p>
      </div>
      <button class="btn-primary" @click="createNew">+ Create Workflow</button>
    </div>
    
    <div v-if="loading" class="loading-state glass">
      Loading workflows...
    </div>
    
    <div v-else class="workflow-grid">
      <div v-for="wf in workflows" :key="wf.id" class="workflow-card glass hover-lift" @click="openEditor(wf.id)">
        <div class="card-header">
          <h3>{{ wf.name }}</h3>
          <span class="status-badge" :class="wf.status === 'ACTIVE' ? 'active' : 'inactive'">
            {{ wf.status || 'INACTIVE' }}
          </span>
        </div>
        <p class="card-desc">Cron: {{ wf.cron_expression || 'Not set' }}</p>
        <div class="card-footer">
          <span class="date">ID: {{ wf.id }}</span>
          <span class="arrow">→</span>
        </div>
      </div>
      
      <div v-if="workflows.length === 0" class="empty-state glass">
        No workflows found. Create one to get started!
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  padding: 24px;
  height: 100%;
  overflow-y: auto;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
}

.header-row h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.header-row p {
  color: var(--text-secondary);
}

.workflow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.workflow-card {
  padding: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px -10px rgba(0,0,0,0.5);
  border-color: var(--accent-hover);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
}

.status-badge {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
}

.status-badge.active {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.status-badge.inactive {
  background: rgba(148, 163, 184, 0.2);
  color: #94a3b8;
}

.card-desc {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.arrow {
  font-size: 1.2rem;
  color: var(--accent-color);
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform: translateX(-10px);
}

.workflow-card:hover .arrow {
  opacity: 1;
  transform: translateX(0);
}

.loading-state, .empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}
</style>
