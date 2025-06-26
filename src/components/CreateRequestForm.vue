<template>
    <div class="w-full max-w-4xl mx-auto mt-6 px-4 space-y-6">
      <!-- Step Progress Bar -->
      <div class="relative h-2 rounded-full bg-gray-200 overflow-hidden">
        <div class="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
             :style="{ width: `${progress}%` }"></div>
      </div>
      <div class="flex justify-between text-sm text-gray-600 font-medium px-1">
        <span>Step 1: Judul</span>
        <span>Step 2: Deadline</span>
        <span>Step 3: Item</span>
      </div>
  
      <!-- Interaktif Alert Tips -->
      <div class="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start gap-4 shadow-sm">
        <div>
          <span class="text-blue-500 text-xl">💡</span>
        </div>
        <div class="flex-1 text-sm text-gray-700">
          <strong class="font-semibold">Tips:</strong> Pastikan judul dan deadline sudah sesuai sebelum menambahkan item.
          <button @click="showDetail = !showDetail" class="ml-2 text-blue-600 underline hover:opacity-80">
            {{ showDetail ? 'Tutup Detail' : 'Lihat Detail' }}
          </button>
          <transition name="fade">
            <p v-if="showDetail" class="mt-2 text-xs text-gray-600">
              Judul membantu penyedia memahami tujuan pengadaan. Deadline tidak bisa memilih hari kemarin. Setiap item memiliki spesifikasi unik.
            </p>
          </transition>
        </div>
      </div>
  
      <!-- Form Fields -->
      <form @submit.prevent="submitRequest" class="space-y-4">
        <!-- Title -->
        <input v-model="form.title"
               type="text"
               placeholder="Judul Permintaan"
               class="w-full p-3 border rounded shadow-sm"
               required
               @input="calculateProgress" />
  
        <!-- Deadline -->
        <input v-model="form.deadline"
               type="datetime-local"
               :min="minDate"
               class="w-full p-3 border rounded shadow-sm"
               required
               @change="calculateProgress" />
  
        <!-- Items Accordion -->
        <div v-for="(item, index) in form.items" :key="index" class="bg-white rounded-lg shadow border">
          <div class="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-t-lg">
            <h3 class="font-semibold">Item {{ index + 1 }}</h3>
            <button type="button"
                    class="text-white hover:text-red-100 text-lg"
                    @click="confirmDeleteItem(index)">×</button>
          </div>
          <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="item.name" placeholder="Nama Barang" class="p-2 border rounded" />
            <input v-model="item.specs" placeholder="Spesifikasi" class="p-2 border rounded" />
            <input v-model="item.brand" placeholder="Brand" class="p-2 border rounded" />
            <input
              :value="item.budget === 0 ? '' : item.budget"
              type="text"
              min="0"
              inputmode="numeric"
              pattern="[0-9]*"
              placeholder="Harga Maksimum"
              class="p-2 border rounded"
              @input="onBudgetInput($event, index)"
            />
            <span class="ml-2">{{ formatCurrency(item.budget) }}</span>
            <!-- Hidden input for the actual number value (optional, for form submission) -->
            <input
              v-model.number="item.budget"
              type="hidden"
            />
            <input v-model.number="item.quantity" type="text" min="1" inputmode="numeric" pattern="[0-9]*" placeholder="Jumlah" class="p-2 border rounded" @input="onQuantityInput(index)" />
          </div>
        </div>
  
        <div class="flex gap-4">
          <button type="button" @click="addItem"
                  class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">+ Tambah Item</button>
          <button type="submit"
                  class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Submit Request</button>
        </div>
      </form>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRequestFormStore } from '@/stores/requestForm'
  import { requestService } from '@/services/request.service'
  import { formatCurrency } from '@/utils/formatters'
  
  const store = useRequestFormStore()
  const form = store
  
  const showDetail = ref(false)
  
  const addItem = () => {
    store.addItem()
    calculateProgress()
  }
  
  const confirmDeleteItem = (index: number) => {
    if (confirm(`Hapus item ${index + 1}?`)) {
      store.removeItem(index)
      calculateProgress()
    }
  }
  
  const progress = ref(0)
  const calculateProgress = () => {
    let value = 0
    if (form.title) value += 33
    if (form.deadline) value += 33
    if (form.items.length > 0) value += 34
    progress.value = value
  }
  
  const minDate = computed(() => {
    const today = new Date()
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
    return today.toISOString().slice(0, 16)
  })
  
  const budgetInputs = ref<string[]>(form.items.map(item => formatCurrency(item.budget || 0)))
  
  watch(() => form.items.length, (newLen, oldLen) => {
    // Keep budgetInputs in sync with form.items
    if (newLen > oldLen) {
      for (let i = oldLen; i < newLen; i++) {
        budgetInputs.value[i] = formatCurrency(form.items[i].budget || 0)
      }
    } else if (newLen < oldLen) {
      budgetInputs.value.splice(newLen)
    }
  })
  
  function onBudgetInput(e: Event, index: number) {
    let raw = (e.target as HTMLInputElement).value.replace(/\D/g, '')
    let num = Number(raw)
    form.items[index].budget = num
  }
  
  function onQuantityInput(index: number) {
    let val = form.items[index].quantity
    if (typeof val !== 'number') {
      val = Number(String(val || '').replace(/\D/g, ''))
      form.items[index].quantity = val
    }
    if (form.items[index].quantity < 1) form.items[index].quantity = 1
  }
  
  onMounted(() => {
    calculateProgress()
  })
  
  const submitRequest = async () => {
    // Validation for negative/zero values
    for (const item of form.items) {
      if (item.budget < 0 || item.quantity <= 0) {
        alert('Budget tidak boleh negatif dan jumlah harus lebih dari 0!')
        return
      }
    }
    try {
      // Transform items to match API format (specs -> spec)
      const transformedItems = form.items.map(item => ({
        name: item.name,
        spec: item.specs, // Map specs to spec
        brand: item.brand,
        budget: item.budget,
        quantity: item.quantity
      }))
      
      await requestService.createRequest({
        deadline: form.deadline,
        items: transformedItems
      })
      alert('Request berhasil dibuat!')
      store.resetForm()
      calculateProgress()
    } catch (error) {
      console.error('Error creating request:', error)
      alert('Gagal membuat request. Silakan coba lagi.')
    }
  }
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>
  