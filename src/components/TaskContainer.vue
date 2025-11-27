<template>
  <div class="flex gap-2 flex-col">
    <div
      class="h-96 p-2.5 min-w-[250px] rounded-md bg-white"
      style="box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)"
    >
      <div
        class="flex justify-between mb-4 pb-2 border-b border-2 border-gray-500 border-x-0 border-t-0"
      >
        <h3>{{ status }}</h3>
        <span class="rounded-full text-[#1975d2] font-bold text-md bg-blue-200 px-2">{{
          items.length
        }}</span>
      </div>
      <draggable
        :list="list"
        group="tasks"
        @change="onListChange"
        item-key="id"
        :animation="200"
        easing="cubic-bezier(0.4, 0, 0.2, 1)"
        ghost-class="ghost"
        chosen-class="chosen"
        drag-class="drag"
        class="flex flex-col gap-2 bg-transparent w-full h-[310px] overflow-y-auto pr-1.5"
      >
        <div
          v-for="(item, idx) in list"
          :key="item.id"
          :class="item.mode !== 'edit' ? 'cursor-move' : 'cursor-default select-none'"
          class="p-2.5 mx-0 bg-blue-400 rounded-sm drag-item hover:bg-blue-600 text-black"
        >
          <span v-if="item.mode === 'edit'" class="flex justify-between">
            <input id="editTask" class="rounded-md border px-2 py-1" v-model.trim="editTask" />
            <button
              class="m-1 cursor-pointer"
              @click="handleSave(item, idx)"
              :disabled="!editTask.length"
            >
              <i class="mdi mdi-checkbox-marked"></i>
            </button>
          </span>
          <span v-else class="flex justify-between">
            {{ item.task }}
            <span>
              <button
                v-if="id === 'to-do'"
                class="ml-3 cursor-pointer"
                @click="handleEdit(item, idx)"
              >
                <i class="mdi mdi-pencil"></i>
              </button>
              <button
                v-if="id === 'to-do'"
                class="mx-3 cursor-pointer"
                @click="handleDelete(item, idx)"
              >
                <i class="mdi mdi-delete"></i>
              </button>

              <button class="cursor-grab select-none">
                <i class="mdi mdi-drag"></i>
              </button>
            </span>
          </span>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const emit = defineEmits(['update:list', 'list-changed'])
const props = defineProps({
  list: { type: Array, default: () => [] },
  status: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
})

let editTask = ref('')

// Reactive list
// const items = reactive([{ id: 1, task: '909009009' }])
// const items = ref([...props.list])
const items = computed({
  get: () => props.list,
  set: (value) => emit('update:list', value),
})

const handleEdit = (i, idx) => {
  items.value[idx].mode = 'edit'
}

const handleDelete = (i, idx) => {
  items.value.splice(idx, 1)
}

const handleSave = (i, idx) => {
  items.value[idx].task = editTask.value
  items.value[idx].mode = ''
}

const onListChange = () => {
  emit('list-changed')
}
</script>

<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
  border: 1px dashed #2196f3;
}

.chosen {
  transform: rotate(5deg);
}

.drag {
  transform: rotate(0deg);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.drag-item {
  transition: all 0.3s ease;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
}

.drag-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateX(5px);
}
</style>
