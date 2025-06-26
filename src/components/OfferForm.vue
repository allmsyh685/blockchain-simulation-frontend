<template>
    <div class="mt-6 space-y-6">
      <h2 class="text-xl font-bold text-gray-800">📝 Form Penawaran</h2>
      <form @submit.prevent="submitOffer" class="space-y-6">
        <div
          v-for="(item, index) in requestItems"
          :key="index"
          class="border border-gray-200 p-4 rounded-md shadow-sm bg-white"
        >
          <!-- Detail Item Asli -->
          <div class="mb-2">
            <p class="text-sm font-semibold text-gray-600">Item #{{ index + 1 }} (Referensi)</p>
            <ul class="text-xs text-gray-500 list-disc ml-4 mt-1">
              <li><strong>Nama:</strong> {{ item.name }}</li>
              <li><strong>Brand:</strong> {{ item.brand }}</li>
              <li><strong>Spesifikasi:</strong> {{ item.spec }}</li>
              <li><strong>Jumlah:</strong> {{ item.quantity }}</li>
              <li><strong>Anggaran / pcs:</strong> {{ formatCurrency(item.budget) }}</li>
            </ul>
          </div>
  
          <!-- Input Penawaran -->
          <div class="grid md:grid-cols-3 gap-4">
            <input v-model="offers[index].brand" type="text" placeholder="Brand Penawaran" class="input" />
            <input v-model="offers[index].spec" type="text" placeholder="Spesifikasi" class="input" />
            <input
              :value="offers[index].price === 0 ? '' : offers[index].price"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              placeholder="Harga / pcs"
              class="input"
              @input="onPriceInput($event, index)"
            />
            <span class="ml-2">{{ formatCurrency(offers[index].price) }}</span>
          </div>
          <!-- Hidden input for the actual number value (optional, for form submission) -->
          <input
            v-model.number="offers[index].price"
            type="hidden"
          />
          <textarea v-model="offers[index].notes" placeholder="Catatan" class="input w-full mt-2" rows="2" required></textarea>
        </div>
  
        <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Kirim Penawaran
        </button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import httpService from '@/services/http'
  import { formatCurrency } from '@/utils/formatters'
  
  interface Item {
    name: string
    brand: string
    spec: string
    quantity: number
    budget: number
  }
  
  interface OfferItem {
    name: string
    brand: string
    spec: string
    price: number
    quantity: number
    notes: string
  }
  
  const props = defineProps<{
    requestId: string
    requestItems: Item[]
  }>()
  
  const offers = ref<OfferItem[]>(props.requestItems.map(item => ({
    name: item.name,
    brand: '',
    spec: '',
    price: 0,
    quantity: item.quantity,
    notes: ''
  })))
  
  const emit = defineEmits(['offerSubmitted'])
  
  const priceInputs = ref<string[]>(offers.value.map(offer => formatCurrency(offer.price || 0)))
  
  watch(() => offers.value.length, (newLen, oldLen) => {
    if (newLen > oldLen) {
      for (let i = oldLen; i < newLen; i++) {
        priceInputs.value[i] = formatCurrency(offers.value[i].price || 0)
      }
    } else if (newLen < oldLen) {
      priceInputs.value.splice(newLen)
    }
  })
  
  const submitOffer = async () => {
    // Validation for negative/zero values
    for (const offer of offers.value) {
      if (offer.price < 0 || offer.quantity <= 0) {
        alert('Harga tidak boleh negatif dan jumlah harus lebih dari 0!')
        return
      }
    }
    try {
      await httpService.post('/offers', {
        requestId: props.requestId,
        items: offers.value
      })
      emit('offerSubmitted')
      alert('Offer berhasil dikirim!')
    } catch (err) {
      console.error(err)
      alert('Gagal mengirim offer.')
    }
  }
  
  function onPriceInput(e: Event, index: number) {
    let raw = (e.target as HTMLInputElement).value.replace(/\D/g, '');
    let num = Number(raw);
    offers.value[index].price = num;
  }
  </script>
  
  <style scoped>
  .input {
    @apply px-3 py-2 border border-gray-300 rounded-md text-sm w-full;
  }
  </style>
  