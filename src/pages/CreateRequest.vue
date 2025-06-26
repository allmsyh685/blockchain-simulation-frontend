<!-- /src/pages/CreateRequestPage.vue -->
<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-blue-600">eProBlock</h1>
      <button
        @click="showModal = true"
        class="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-5 py-2 rounded-lg shadow hover:opacity-90 transition"
      >
        Buat Permintaan Baru
      </button>
    </div>

    <CreateRequestForm v-model="showModal" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CreateRequestForm from '@/components/CreateRequestForm.vue';

const showModal = ref(false)
</script>
