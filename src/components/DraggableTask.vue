<template>
  <div class="flex justify-start flex-col items-center p-5 bg-[#f5f5f5] min-h-screen">
    <h3 v-if="false" class="font-bold">Draggable Task</h3>
    <div
      class="flex p-2 gap-2 justify-center bg-white rounded-md"
      style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)"
    >
      <input
        id="newTask"
        class="rounded-md border p-1.5"
        placeholder="New Task"
        v-model.trim="newTask"
      />
      <button
        :disabled="!newTask.length"
        class="rounded-md px-2 cursor-pointer bg-blue-300 disabled:opacity-25 task-btn disabled:cursor-not-allowed"
        @click="handleAddTask"
      >
        Add New Task
      </button>
      <button
        class="rounded-md px-2 cursor-pointer bg-red-800 text-white disabled:opacity-25 disabled:cursor-not-allowed"
        @click="handleReset"
      >
        Reset
      </button>
    </div>
    <div class="flex gap-3 my-5">
      <TaskContainer
        v-model:list="todoList"
        status="To Do"
        @list-changed="handleListChanged"
        id="to-do"
      />
      <TaskContainer v-model:list="progressList" status="In Progress" id="in-progress-list" />
      <TaskContainer v-model:list="doneList" status="Done" id="done-list" />
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue'
import TaskContainer from './TaskContainer.vue'
import { useCounterStore } from '@/stores/counter'

const countStore = useCounterStore()

let newTask = ref('')

const handleAddTask = () => {
  countStore.toDoList.push({ id: Date.now(), task: newTask.value, mode: '' })
  newTask.value = ''
}

const todoList = computed({
  get: () => countStore.toDoList,
  set: (val) => (countStore.toDoList = val),
})
const progressList = computed({
  get: () => countStore.inProgressList,
  set: (val) => (countStore.inProgressList = val),
})

const doneList = computed({
  get: () => countStore.doneList,
  set: (val) => (countStore.doneList = val),
})

const handleListChanged = () => {
  newTask.value = ''
}

const handleReset = () => {
  newTask.value = ''
  countStore.resetAllList()
}

onBeforeMount(() => {
  const savedState = sessionStorage.getItem('kanban')

  if (savedState) {
    Object.assign(countStore.$state, JSON.parse(savedState))
  }
})

watch(
  countStore.$state,
  (newState) => {
    sessionStorage.setItem('kanban', JSON.stringify(newState))
  },
  { deep: true },
)
</script>

<style scoped>
.task-btn {
  transition: all 0.3s ease;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
}
</style>
