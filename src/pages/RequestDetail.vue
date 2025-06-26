<template>
    <div class="max-w-5xl mx-auto p-6">
      <h1 class="text-3xl font-bold mb-4 text-gray-800">📋 Detail Permintaan Pengadaan</h1>
  
      <div v-if="request" class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div class="mb-4">
          <p class="text-sm text-gray-600">👤 {{ request.user?.name || 'User Tidak Dikenal' }}</p>
          <p class="text-sm text-gray-500">{{ request.user?.email }}</p>
          <p class="text-sm text-gray-500 mt-1">🕒 Deadline: {{ formatDate(request.deadline) }}</p>
          <p class="text-sm text-gray-500 mt-1">📦 Status: <span class="font-semibold">{{ request.status }}</span></p>
          <p class="text-sm text-green-600 mt-1">�� Total Anggaran: {{ formatCurrency(totalBudget(request.items)) }}</p>
        </div>
  
        <!-- List Item -->
        <div class="mt-4">
          <h2 class="text-lg font-semibold text-gray-700 mb-2">🛠️ Daftar Item</h2>
          <div
            v-for="(item, idx) in request.items"
            :key="idx"
            class="bg-gray-50 p-4 rounded-md border mb-3"
          >
            <p class="text-gray-700 font-medium">{{ item.name }} ({{ item.quantity }} pcs)</p>
            <p class="text-sm text-gray-600">Brand: {{ item.brand }}</p>
            <p class="text-sm text-gray-600">Spesifikasi: {{ item.spec }}</p>
            <p class="text-sm text-gray-600">Anggaran/pcs: {{ formatCurrency(item.budget) }}</p>
          </div>
        </div>
  
        <!-- Tombol Tampilkan Form -->
        <div v-if="!showForm && request && request.user && request.user._id !== authStore.user?._id" class="mt-6">
          <button
            @click="showForm = true"
            class="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Buat Offer
          </button>
        </div>
  
        <!-- Form Penawaran -->
        <OfferForm
          v-if="showForm"
          :request-id="requestId"
          :request-items="request.items"
          @offerSubmitted="handleOfferSuccess"
        />
      </div>
  
      <!-- Loading -->
      <div v-else class="text-center text-gray-500 mt-10">Memuat data permintaan...</div>
  
      <!-- Snackbar -->
      <div
        v-if="snackbar.show"
        class="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow"
      >
        {{ snackbar.message }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { requestService } from '@/services/request.service'
  import OfferForm from '@/components/OfferForm.vue'
  import { useAuthStore } from '@/stores/auth'
  import { formatCurrency, formatDate } from '@/utils/formatters'
  
  const route = useRoute()
  const requestId = route.params.id as string
  const request = ref<any>(null)
  const showForm = ref(false)
  const snackbar = ref({ show: false, message: '' })
  const authStore = useAuthStore()
  
  const fetchRequest = async () => {
    try {
      request.value = await requestService.getRequestById(requestId)
    } catch (err) {
      console.error('Gagal memuat data:', err)
    }
  }
  
  const totalBudget = (items: any[]) =>
    items.reduce((sum, item) => sum + item.budget * item.quantity, 0)
  
  const handleOfferSuccess = () => {
    snackbar.value = {
      show: true,
      message: 'Offer berhasil dikirim!'
    }
    setTimeout(() => (snackbar.value.show = false), 3000)
    showForm.value = false
  }
  
  onMounted(fetchRequest)
  </script>
  