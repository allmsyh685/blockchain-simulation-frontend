<template>
    <div class="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main class="flex-1 p-4">
        <slot />
      </main>
    </div>
  </template>
  
  <script lang="ts" setup>
  import Navbar from '@/components/Navbar.vue'
  </script>
  