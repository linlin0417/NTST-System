<script setup lang="ts">
import { ref } from 'vue'

const stats = ref([
  { title: 'Total Workflows', value: '12', trend: '+2 this week' },
  { title: 'Executions (24h)', value: '1,284', trend: '+15%' },
  { title: 'Success Rate', value: '99.8%', trend: 'Stable' }
])
</script>

<template>
  <div class="dashboard page-container">
    <div class="welcome-section">
      <h1>Welcome back!</h1>
      <p>Here's what's happening with your workflows today.</p>
    </div>
    
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.title" class="stat-card glass hover-lift">
        <h3 class="stat-title">{{ stat.title }}</h3>
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-trend">{{ stat.trend }}</div>
      </div>
    </div>
    
    <div class="activity-section glass">
      <h3>Recent Activity</h3>
      <div class="empty-state">
        <p>No recent activity. Start by creating a workflow!</p>
        <router-link to="/workflows" class="btn-primary" style="display: inline-block; margin-top: 10px; text-decoration: none;">
          Go to Workflows
        </router-link>
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

.welcome-section {
  margin-bottom: 32px;
}

.welcome-section h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(to right, #fff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-section p {
  color: var(--text-secondary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px -10px rgba(0,0,0,0.5);
  border-color: rgba(255,255,255,0.15);
}

.stat-title {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-trend {
  font-size: 0.875rem;
  color: #10b981;
}

.activity-section {
  padding: 24px;
  min-height: 300px;
}

.activity-section h3 {
  font-size: 1.25rem;
  margin-bottom: 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-secondary);
}
</style>
