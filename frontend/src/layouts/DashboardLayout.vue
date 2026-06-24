<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const sidebarCollapsed = ref(false)

const navItems = [
  { path: '/', label: '總覽', icon: 'grid' },
  { path: '/collectors', label: '收集器', icon: 'radar' },
  { path: '/data', label: '資料瀏覽', icon: 'layers' },
]

const currentTitle = computed(() => {
  const item = navItems.find(n => n.path === route.path)
  return item ? item.label : route.name?.toString() || 'NTST System'
})

const now = ref(new Date())
setInterval(() => { now.value = new Date() }, 60000)
</script>

<template>
  <div class="shell">
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-brand">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
        </div>
        <span class="brand-text" v-show="!sidebarCollapsed">NTST</span>
      </div>

      <nav class="sidebar-nav">
        <router-link
          v-for="item in navItems" :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ active: route.path === item.path }"
        >
          <svg v-if="item.icon === 'grid'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <svg v-if="item.icon === 'radar'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12l4-4"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="10"/></svg>
          <svg v-if="item.icon === 'layers'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          <span class="nav-label" v-show="!sidebarCollapsed">{{ item.label }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline :points="sidebarCollapsed ? '9 18 15 12 9 6' : '15 18 9 12 15 6'"/></svg>
        </button>
        <div class="system-status" v-show="!sidebarCollapsed">
          <span class="pulse-dot"></span>
          <span>系統運行中</span>
        </div>
      </div>
    </aside>

    <div class="main-area">
      <header class="topbar glass">
        <h1 class="topbar-title">{{ currentTitle }}</h1>
        <div class="topbar-right">
          <span class="topbar-time">{{ now.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }) }}</span>
        </div>
      </header>

      <main class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  height: 100vh;
  width: 100vw;
  background:
    radial-gradient(ellipse at 20% 0%, rgba(167,139,250,0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 100%, rgba(52,211,153,0.04) 0%, transparent 50%),
    var(--bg-primary);
}

.sidebar {
  width: 240px;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  transition: width 0.25s ease;
  overflow: hidden;
  flex-shrink: 0;
}
.sidebar.collapsed { width: 64px; }

.sidebar-brand {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  border-bottom: 1px solid var(--border);
}
.brand-icon {
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.brand-icon svg { width: 22px; height: 22px; color: var(--accent); }
.brand-text {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 2px;
  white-space: nowrap;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.15s ease;
}
.nav-link svg { width: 20px; height: 20px; flex-shrink: 0; }
.nav-label { white-space: nowrap; }
.nav-link:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}
.nav-link.active {
  background: rgba(167, 139, 250, 0.1);
  color: var(--accent);
}

.sidebar-footer {
  padding: 16px 12px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.collapse-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}
.collapse-btn:hover { color: var(--text-primary); }
.collapse-btn svg { width: 18px; height: 18px; }

.system-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: var(--text-muted);
}
.pulse-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 6px var(--success);
  animation: pulse 2.5s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px 20px;
  gap: 16px;
}
.topbar {
  height: 52px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: var(--glass);
}
.topbar-title {
  font-size: 1.05rem;
  font-weight: 600;
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.topbar-time {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
