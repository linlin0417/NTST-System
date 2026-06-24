<script setup lang="ts">
import { ref } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'

const { onConnect, addEdges } = useVueFlow()
const route = useRoute()
const router = useRouter()

const nodes = ref([
  { id: '1', type: 'input', label: 'Webhook (Start)', position: { x: 250, y: 5 }, data: { url: '/webhook/test' } },
  { id: '2', type: 'default', label: 'Data Transform', position: { x: 100, y: 100 }, data: { mapping: '{{1.payload}}' } },
  { id: '3', type: 'output', label: 'Database Save', position: { x: 400, y: 200 }, data: { action: 'CREATE', model: 'Log' } },
])

const edges = ref([
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
])

onConnect((params) => addEdges(params))

async function saveFlow() {
  try {
    const flow = { name: `Workflow ${route.params.id || 'New'}`, nodes: nodes.value, edges: edges.value }
    await axios.post('/api/workflows', flow)
    alert("已成功匯出流程至後端 SQLite！")
  } catch (e: any) {
    alert("匯出失敗: " + e.message)
  }
}

function goBack() {
  router.push('/workflows')
}
</script>

<template>
  <div class="editor-layout">
    <div class="editor-header glass">
      <div class="header-left">
        <button class="icon-btn" @click="goBack">←</button>
        <h3>Editing Workflow: {{ route.params.id }}</h3>
      </div>
      <div class="header-right">
        <button class="btn-primary" @click="saveFlow">Save Workflow</button>
      </div>
    </div>
    <div class="editor-body">
      <div class="vue-flow-wrapper">
        <VueFlow v-model:nodes="nodes" v-model:edges="edges" fit-view-on-init class="dark-flow">
          <Background pattern-color="#334155" />
          <Controls />
        </VueFlow>
      </div>
      <div class="config-sidebar glass">
        <h3>Node Configuration</h3>
        <p class="desc">Select a node on the canvas to configure its properties.</p>
        <div class="placeholder-config">
          <i>(Configuration panel)</i>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.editor-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-btn {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.editor-body {
  display: flex;
  flex: 1;
  gap: 16px;
  height: calc(100% - 70px);
}

.vue-flow-wrapper {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-primary);
  border: 1px solid var(--glass-border);
}

.config-sidebar {
  width: 300px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.config-sidebar h3 {
  font-size: 1.125rem;
  margin-bottom: 8px;
}

.desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.placeholder-config {
  flex: 1;
  border: 1px dashed var(--glass-border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

/* Make Vue Flow look dark mode friendly */
.dark-flow {
  --vf-node-bg: var(--bg-secondary);
  --vf-node-text: var(--text-primary);
  --vf-connection-path: var(--text-secondary);
  --vf-handle: var(--accent-color);
}

.vue-flow__node {
  background: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--glass-border) !important;
  border-radius: 8px !important;
  padding: 10px !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
}

.vue-flow__node-input, .vue-flow__node-default, .vue-flow__node-output {
  background: var(--bg-secondary) !important;
  border-color: var(--glass-border) !important;
}
</style>
