<script setup lang="ts">
import { ref } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'

const { onConnect, addEdges } = useVueFlow()

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

function exportFlow() {
  const flow = { nodes: nodes.value, edges: edges.value }
  console.log("Exported Workflow JSON:", JSON.stringify(flow, null, 2))
  alert("已匯出流程至 Console！")
}
</script>

<template>
  <div class="layout">
    <div class="sidebar">
      <h2>NTST System</h2>
      <div class="panel">
        <h3>節點設定</h3>
        <p>點選畫布上的節點以編輯參數</p>
        <!-- MVP Placeholder for config panel -->
      </div>
      <button @click="exportFlow">匯出至後端</button>
    </div>
    
    <div class="vue-flow-wrapper">
      <VueFlow v-model:nodes="nodes" v-model:edges="edges" fit-view-on-init>
        <Background />
        <Controls />
      </VueFlow>
    </div>
  </div>
</template>

<style>
body, html {
  margin: 0;
  padding: 0;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

#app {
  height: 100vh;
}

.layout {
  display: flex;
  height: 100%;
}

.sidebar {
  width: 300px;
  background: #f8f9fa;
  border-right: 1px solid #ddd;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.panel {
  flex: 1;
  margin-top: 20px;
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

button {
  margin-top: 20px;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

.vue-flow-wrapper {
  flex: 1;
  height: 100%;
}
</style>
