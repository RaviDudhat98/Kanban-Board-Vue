<template>
  <div class="flex justify-center p-5 sticky">
    <span v-for="i in navList" :key="i" class="mx-3">
      <a :href="i.path" class="text-xl font-bold">{{ i.name }}</a>
    </span>
  </div>
  <router-view />
</template>

<script setup>
const navList = [
  { name: 'Task', path: '/' },
  // { name: 'Kanban', path: '/kanban' },
]
</script>

<style scoped></style>
