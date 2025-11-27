<template>
  <div class="kanban-board">
    <div v-for="column in columns" :key="column.id" class="kanban-column">
      <div class="column-header">
        <h3>{{ column.title }}</h3>
        <span class="task-count">{{ column.tasks.length }}</span>
      </div>

      <draggable
        v-model="column.tasks"
        :group="{ name: 'kanban', pull: true, put: true }"
        :animation="200"
        ghost-class="ghost-card"
        chosen-class="chosen-card"
        drag-class="drag-card"
        class="task-list"
        @change="onTaskChange"
        @start="onDragStart"
        @end="onDragEnd"
        item-key="id"
      >
        <template #item="{ element: task }">
          <div class="task-card" :class="getPriorityClass(task.priority)">
            <div class="task-header">
              <span class="task-title">{{ task.title }}</span>
              <button @click="editTask(task)" class="edit-btn">✏️</button>
            </div>

            <p class="task-description">{{ task.description }}</p>

            <div class="task-footer">
              <div class="task-assignee">
                <img :src="task.assignee.avatar" :alt="task.assignee.name" class="avatar" />
                <span>{{ task.assignee.name }}</span>
              </div>

              <div class="task-meta">
                <span class="priority">{{ task.priority }}</span>
                <span class="due-date">{{ formatDate(task.dueDate) }}</span>
              </div>
            </div>
          </div>
        </template>
      </draggable>

      <button @click="addTask(column.id)" class="add-task-btn">+ Add Task</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const columns = ref([
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      {
        id: '1',
        title: 'Design new homepage',
        description: 'Create wireframes and mockups',
        priority: 'high',
        assignee: { id: '1', name: 'John Doe', avatar: '/avatars/john.jpg' },
        dueDate: new Date('2024-02-15'),
        columnId: 'todo',
      },
    ],
  },
  { id: 'inprogress', title: 'In Progress', tasks: [] },
  { id: 'review', title: 'Review', tasks: [] },
  { id: 'done', title: 'Done', tasks: [] },
])

const onTaskChange = (event) => {
  if (event.added) {
    const task = event.added.element
    const targetColumn = columns.value.find((col) => col.tasks.includes(task))
    if (targetColumn) {
      task.columnId = targetColumn.id
    }
  }

  saveKanbanState()
}

const onDragStart = () => {
  document.body.classList.add('dragging')
}

const onDragEnd = () => {
  document.body.classList.remove('dragging')
}

const getPriorityClass = (priority) => {
  return `priority-${priority}`
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const addTask = (columnId) => {
  // Add your logic
  columns.value.forEach((i) => {
    if (i.id === columnId) {
      i.tasks.push({
        id: '1',
        title: 'Design new homepage',
        description: 'Create wireframes and mockups',
        priority: 'high',
        assignee: { id: '1', name: 'John Doe', avatar: '/avatars/john.jpg' },
        dueDate: new Date('2024-02-15'),
        columnId: 'todo',
      })
    }
  })
}

const editTask = (task) => {
  // Edit your task
  console.log('Edit task:', task)
}

const saveKanbanState = async () => {
  try {
    await fetch('/api/kanban', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(columns.value),
    })
  } catch (err) {
    console.error('Failed to save:', err)
  }
}
</script>

<style scoped>
.kanban-board {
  display: flex;
  gap: 20px;
  padding: 20px;
  min-height: 100vh;
  background: #f5f5f5;
}

.kanban-column {
  min-width: 280px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #eee;
}

.task-count {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.task-list {
  min-height: 200px;
  margin-bottom: 16px;
}

.task-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: grab;
  transition: all 0.2s ease;
}

.task-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.task-card:active {
  cursor: grabbing;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-title {
  font-weight: 600;
  font-size: 14px;
}

.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.task-card:hover .edit-btn {
  opacity: 1;
}

.task-description {
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.4;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
}

.task-assignee {
  display: flex;
  align-items: center;
  gap: 6px;
}

.avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.task-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.priority-high {
  border-left: 4px solid #f44336;
}
.priority-medium {
  border-left: 4px solid #ff9800;
}
.priority-low {
  border-left: 4px solid #4caf50;
}

.ghost-card {
  opacity: 0.5;
  background: #e3f2fd;
  transform: rotate(2deg);
}

.chosen-card {
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.add-task-btn {
  width: 100%;
  padding: 10px;
  border: 2px dashed #ccc;
  background: transparent;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.add-task-btn:hover {
  border-color: #2196f3;
  color: #2196f3;
  background: #f3f9ff;
}

/* Global dragging state */
:global(body.dragging) .kanban-column {
  background: #f9f9f9;
}

.file-manager {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-primary {
  background: #2196f3;
  color: white;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.view-controls {
  margin-left: auto;
  display: flex;
  gap: 4px;
}

.view-btn {
  padding: 8px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-size: 16px;
}

.view-btn.active {
  background: #2196f3;
  color: white;
}

.breadcrumb {
  padding: 12px 16px;
  background: #f5f5f5;
  font-size: 14px;
}

.breadcrumb-item {
  cursor: pointer;
  color: #2196f3;
}

.breadcrumb-item:hover {
  text-decoration: underline;
}

.file-grid {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.file-grid.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.file-grid.list {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.file-item {
  background: white;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.file-item:hover {
  background: #f8f9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.file-item.selected {
  border-color: #2196f3;
  background: #e3f2fd;
}

.file-grid.grid .file-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.file-grid.list .file-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
}

.file-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.file-grid.list .file-icon {
  font-size: 20px;
  margin-bottom: 0;
}

.file-name {
  font-weight: 500;
  font-size: 14px;
  word-break: break-word;
  margin-bottom: 4px;
}

.file-grid.list .file-name {
  flex: 1;
  margin-bottom: 0;
}

.file-meta {
  font-size: 12px;
  color: #666;
}

.file-grid.list .file-meta {
  display: flex;
  gap: 16px;
}

.file-actions {
  display: flex;
  gap: 8px;
}

.file-actions button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.file-actions button:hover {
  background: #f0f0f0;
}

.file-actions button.danger:hover {
  background: #ffebee;
  color: #d32f2f;
}

.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 120px;
  overflow: hidden;
}

.context-menu div {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}

.context-menu div:hover {
  background: #f5f5f5;
}

.context-menu .separator {
  height: 1px;
  background: #eee;
  margin: 4px 0;
  padding: 0;
}

.context-menu .danger {
  color: #d32f2f;
}

.upload-progress {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-bar {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #2196f3;
  transition: width 0.3s ease;
}

.shopping-app {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  padding: 24px;
  min-height: 100vh;
  background: #f8f9fa;
}

.products-section h2,
.cart-section h2 {
  margin-bottom: 16px;
  color: #333;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.product-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: grab;
  transition: all 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
}

.product-card h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
}

.price {
  font-size: 18px;
  font-weight: bold;
  color: #2196f3;
  margin: 8px 0;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.stars {
  color: #ffd700;
}

.rating-text {
  color: #666;
}

.cart-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  height: fit-content;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cart-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.total {
  font-weight: bold;
  font-size: 18px;
  color: #2196f3;
}

.cart-items {
  min-height: 200px;
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.cart-item:hover {
  background: #e3f2fd;
}

.cart-item.newly-added {
  background: #c8e6c9;
  transform: scale(1.02);
}

.cart-item img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
}

.item-details .price {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.qty-btn:hover {
  background: #f0f0f0;
}

.quantity {
  min-width: 20px;
  text-align: center;
  font-weight: 500;
}

.remove-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: #f44336;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.remove-btn:hover {
  background: #d32f2f;
}

.trash-zone {
  margin: 20px 0;
  border: 2px dashed #ccc;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  min-height: 80px;
}

.trash-zone.active {
  border-color: #f44336;
  background: #ffebee;
}

.trash-area {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.trash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80px;
  color: #999;
  pointer-events: none;
}

.trash-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.trash-text {
  font-size: 14px;
}

.checkout-btn {
  width: 100%;
  padding: 16px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.checkout-btn:hover:not(:disabled) {
  background: #45a049;
}

.checkout-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Global styles for notifications */
:global(.removal-notification) {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #f44336;
  color: white;
  padding: 12px 20px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation:
    slideIn 0.3s ease,
    slideOut 0.3s ease 2.7s;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}
</style>
