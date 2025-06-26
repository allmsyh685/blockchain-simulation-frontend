<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
      <h1 class="text-3xl font-bold text-blue-700">Daftar Transaksi</h1>
      <div class="flex gap-2 w-full sm:w-auto">
        <input type="text" placeholder="Cari transaksi..." class="w-full sm:w-64 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" disabled />
        <!-- Placeholder for future filter/search -->
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Transactions Grid -->
    <div v-else-if="transactions.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="tx in transactions" :key="tx._id" class="bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-6 flex flex-col justify-between border border-gray-100 relative group">
        <!-- Status Badge -->
        <span :class="['absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold', statusBadgeClass(tx.status)]">
          {{ statusLabel(tx.status) }}
        </span>
        <!-- Main Info -->
        <router-link :to="`/transaction/${tx._id}`" class="block mb-4 cursor-pointer">
          <h2 class="text-xl font-semibold text-gray-800 mb-2 truncate">{{ tx.request?.judul || `Pengadaan ke ${transactions.indexOf(tx) + 1}` }}</h2>
          <!-- Vendor Avatar and Name -->
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-200 text-blue-700 font-bold text-lg">
              {{ (tx.vendor?.name || 'V').charAt(0).toUpperCase() }}
            </span>
            <span class="text-sm text-gray-600">Vendor:</span>
            <span class="font-medium text-gray-700">{{ tx.vendor?.name || 'Tidak diketahui' }}</span>
          </div>
          <!-- Client Avatar and Name -->
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-200 text-green-700 font-bold text-lg">
              {{ (tx.buyer?.name || 'C').charAt(0).toUpperCase() }}
            </span>
            <span class="text-sm text-gray-600">Client:</span>
            <span class="font-medium text-gray-700">{{ tx.buyer?.name || 'Tidak diketahui' }}</span>
          </div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-gray-500 text-sm">Total:</span>
            <span class="font-bold text-lg text-blue-700">{{ formatRupiah(tx.totalAmount) }}</span>
          </div>
          <div class="text-xs text-gray-400">Dibuat: {{ new Date(tx.createdAt).toLocaleString() }}</div>
        </router-link>
        <!-- Actions -->
        <div class="flex gap-2 mt-4">
          <button v-if="canDownloadTokens(tx)" @click.stop.prevent="openQrModal(tx)" class="flex-1 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:from-green-500 hover:to-blue-600 transition">Download QR Token</button>
          <router-link :to="`/transaction/${tx._id}`" class="flex-1 bg-gray-100 text-blue-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-50 transition text-center">Detail</router-link>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
      <p class="mt-1 text-sm text-gray-500">You don't have any transactions yet.</p>
    </div>

    <!-- QR Modal -->
    <div v-if="showQrModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full relative">
        <button @click="showQrModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        <h2 class="text-2xl font-bold mb-6 text-blue-700">Download QR Token</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto">
          <div v-for="(qr, idx) in qrImages" :key="idx" class="flex flex-col items-center border p-4 rounded-xl bg-gray-50 shadow-sm">
            <img :src="qr.url" :alt="`QR for ${qr.token}`" class="mb-2 w-32 h-32 object-contain rounded" />
            <div class="text-xs break-all mb-1 font-semibold text-gray-700">{{ qr.itemName }}</div>
            <div class="text-xs break-all mb-2 text-gray-500">{{ qr.token }}</div>
            <button @click="downloadQr(qr.url, `${qr.itemName}-${qr.token}.png`)" class="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600">Download</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { transactionService } from '@/services'
import { useNotificationStore } from '@/stores/notification'
import QRCode from 'qrcode'
import { useAuthStore } from '@/stores/auth'

interface TransactionItem {
  name: string;
  quantity: number;
  tokens: string[];
}

interface Transaction {
  _id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  request?: { judul?: string };
  offer?: any;
  buyer?: { name?: string; _id?: string };
  vendor?: { name?: string; _id?: string };
  items: TransactionItem[];
}

const transactions = ref<Transaction[]>([]);
const loading = ref(false);
const notificationStore = useNotificationStore();
const authStore = useAuthStore();

const showQrModal = ref(false);
const qrTransaction = ref<Transaction | null>(null);
const qrImages = ref<{ itemName: string; token: string; url: string }[]>([]);

const getTransactions = async () => {
  loading.value = true;
  try {
    const response = await transactionService.getMyTransactions();
    transactions.value = (response.data || []) as unknown as Transaction[];
  } catch (err) {
    console.error('Failed to load transactions:', err);
    notificationStore.error('Failed to load transactions');
    transactions.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getTransactions()
})

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)

const statusBadgeClass = (status: string) => {
  switch (status) {
    case 'waiting_payment': return 'bg-yellow-100 text-yellow-800 border border-yellow-300'
    case 'in_progress': return 'bg-blue-100 text-blue-800 border border-blue-300'
    case 'shipped': return 'bg-indigo-100 text-indigo-800 border border-indigo-300'
    case 'validating': return 'bg-orange-100 text-orange-800 border border-orange-300'
    case 'completed': return 'bg-green-100 text-green-800 border border-green-300'
    case 'cancelled': return 'bg-red-100 text-red-800 border border-red-300'
    default: return 'bg-gray-100 text-gray-700 border border-gray-200'
  }
}

const statusLabel = (status: string) => {
  switch (status) {
    case 'waiting_payment': return 'Menunggu Pembayaran'
    case 'in_progress': return 'Diproses'
    case 'shipped': return 'Dikirim'
    case 'validating': return 'Validasi'
    case 'completed': return 'Selesai'
    case 'cancelled': return 'Dibatalkan'
    default: return status
  }
}

const isVendor = (tx: Transaction) => {
  // Check if the logged-in user is the vendor for this transaction
  return tx.vendor && authStore.user && tx.vendor._id === authStore.user._id;
}

const canDownloadTokens = (tx: Transaction) => {
  return isVendor(tx) && (tx.status === 'in_progress' || tx.status === 'completed');
}

const openQrModal = async (tx: Transaction) => {
  qrTransaction.value = tx;
  qrImages.value = [];
  for (const item of tx.items) {
    for (const token of item.tokens) {
      const url = await QRCode.toDataURL(token, { width: 200, margin: 2 });
      qrImages.value.push({ itemName: item.name, token, url });
    }
  }
  showQrModal.value = true;
}

const downloadQr = (imgUrl: string, fileName: string) => {
  const a = document.createElement('a');
  a.href = imgUrl;
  a.download = fileName;
  a.click();
}
</script>