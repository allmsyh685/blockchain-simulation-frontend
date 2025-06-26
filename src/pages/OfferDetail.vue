<template>
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Detail Offer</h1>
  
      <div v-if="loading" class="text-center text-gray-500">Memuat detail offer...</div>
      <div v-else-if="!offer" class="text-center text-red-500">Offer tidak ditemukan.</div>
      <div v-else>
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-indigo-600">Vendor: {{ offer.user?.name || 'Tidak Diketahui' }}</h2>
          <p class="text-sm text-gray-500">Status: <span class="capitalize">{{ offer.status }}</span></p>
          <p class="text-sm text-gray-500">Total Item: {{ offer.items.length }}</p>
          <p class="text-sm text-gray-500 mb-2">
            Total Harga: <strong>{{ formatCurrency(getTotalOffer(offer.items)) }}</strong>
          </p>
        </div>
  
        <div class="space-y-4">
          <div
            v-for="(item, index) in offer.items"
            :key="index"
            class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <h3 class="text-md font-semibold text-gray-700 mb-1">{{ item.name }}</h3>
            <p class="text-sm text-gray-500">Jumlah: {{ item.quantity }}</p>
            <p class="text-sm text-gray-500">Harga per item: {{ formatCurrency(item.price) }}</p>
            <p class="text-sm text-gray-500">Subtotal: {{ formatCurrency(item.price * item.quantity) }}</p>
            <p class="text-sm text-gray-500 italic">Catatan: {{ item.notes || '-' }}</p>
          </div>
        </div>
  
        <div class="mt-8 text-right">
          <button
            @click="acceptOffer"
            class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
            :disabled="accepting || offer.status === 'accepted'"
          >
            {{ accepting ? 'Memproses...' : offer.status === 'accepted' ? 'Offer Diterima' : 'Terima Offer' }}
          </button>
        </div>
      </div>
  
      <!-- Snackbar Notification -->
      <div
        v-if="snackbar.show"
        class="fixed bottom-6 right-6 px-4 py-3 rounded shadow-md text-white"
        :class="snackbar.type === 'success' ? 'bg-green-500' : 'bg-red-500'"
      >
        {{ snackbar.message }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from '@/utils/axios'
  import { formatCurrency } from '@/utils/formatters'
  
  const route = useRoute()
  const router = useRouter()
  
  const offerId = route.params.offerId as string
  const offer = ref<any>(null)
  const loading = ref(true)
  const accepting = ref(false)
  
  // Snackbar custom
  const snackbar = ref({
    show: false,
    message: '',
    type: 'success', // 'success' | 'error'
  })
  
  const showSnackbar = (message: string, type: 'success' | 'error') => {
    snackbar.value = { show: true, message, type }
    setTimeout(() => {
      snackbar.value.show = false
    }, 3000)
  }
  
  const fetchOfferDetail = async () => {
    try {
      const response = await axios.get(`/offers/${offerId}`)
      offer.value = response.data
    } catch (error) {
      console.error('Gagal memuat detail offer:', error)
      showSnackbar('Gagal memuat detail offer.', 'error')
    } finally {
      loading.value = false
    }
  }
  
  const getTotalOffer = (items: any[]) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }
  
  const acceptOffer = async () => {
    if (!confirm('Yakin ingin menerima offer ini?')) return
  
    accepting.value = true
    try {
      await axios.post(`/transactions/accept/${offerId}`)
      showSnackbar('Offer berhasil diterima!', 'success')
      await fetchOfferDetail() // refresh status
    } catch (error) {
      console.error('Gagal menerima offer:', error)
      showSnackbar('Gagal menerima offer.', 'error')
    } finally {
      accepting.value = false
    }
  }
  
  onMounted(fetchOfferDetail)
  </script>
  