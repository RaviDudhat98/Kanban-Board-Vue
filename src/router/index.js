import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Task', component: () => import('../components/DraggableTask.vue') },
  { path: '/kanban', name: 'Kanban', component: () => import('../components/KanbanBoard.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
