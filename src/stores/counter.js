import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const toDoList = ref([])
  const inProgressList = ref([])
  const doneList = ref([])

  const resetAllList = () => {
    toDoList.value = []
    inProgressList.value = []
    doneList.value = []
  }

  return { toDoList, inProgressList, doneList, resetAllList }
})
