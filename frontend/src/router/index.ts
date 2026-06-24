import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import Overview from '../views/Overview.vue'
import Collectors from '../views/Collectors.vue'
import DataExplorer from '../views/DataExplorer.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: DashboardLayout,
      children: [
        { path: '', name: 'Overview', component: Overview },
        { path: 'collectors', name: 'Collectors', component: Collectors },
        { path: 'data', name: 'DataExplorer', component: DataExplorer }
      ]
    }
  ]
})

export default router
