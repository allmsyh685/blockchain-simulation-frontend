<template>
  <div class="p-6 max-w-3xl mx-auto">
    <!-- Header Bar -->
    <div class="flex items-center gap-4 mb-6">
      <router-link to="/transactions" class="text-blue-600 hover:underline flex items-center">
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Kembali
      </router-link>
      <h1 class="text-3xl font-bold text-blue-700">Detail Transaksi</h1>
    </div>

    <div v-if="transaction" class="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-1">{{ transaction.request?.judul || 'Tanpa Judul' }}</h2>
          <div class="flex items-center gap-2 mb-2">
            <span :class="['px-3 py-1 rounded-full text-xs font-semibold', statusBadgeClass(transaction.status)]">
              {{ statusLabel(transaction.status) }}
            </span>
            <span class="text-xs text-gray-400">#{{ transaction._id.slice(-6) }}</span>
          </div>
          <div class="flex items-center gap-4 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-200 text-blue-700 font-bold text-base">
                {{ (transaction.vendor?.name || 'V').charAt(0).toUpperCase() }}
              </span>
              <span>Vendor:</span>
              <span class="font-medium text-gray-700">{{ transaction.vendor?.name || '-' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-200 text-green-700 font-bold text-base">
                {{ (transaction.buyer?.name || 'C').charAt(0).toUpperCase() }}
              </span>
              <span>Pembeli:</span>
              <span class="font-medium text-gray-700">{{ transaction.buyer?.name || '-' }}</span>
            </div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-gray-500 text-sm mb-1">Dibuat: {{ formatDateTime(transaction.createdAt) }}</div>
          <div class="text-2xl font-bold text-blue-700">{{ formatCurrency(transaction.totalAmount) }}</div>
        </div>
      </div>

      <hr class="my-6" />

      <!-- Items Table -->
      <div>
        <h3 class="text-lg font-semibold mb-2 text-gray-800">Barang dalam Transaksi</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm border rounded-lg">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-4 py-2 text-left">Nama Barang</th>
                <th class="px-4 py-2 text-left">Jumlah</th>
                <th class="px-4 py-2 text-left">Tokens</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in transaction.items" :key="item.name" class="border-t">
                <td class="px-4 py-2 font-medium text-gray-700">{{ item.name }}</td>
                <td class="px-4 py-2">{{ item.quantity }}</td>
                <td class="px-4 py-2">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="(token, idx) in item.tokens" :key="idx" class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-mono">{{ token }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Actions Section -->
      <div class="mt-8 space-y-8">
        <!-- Vendor Status Update -->
        <div v-if="isVendor">
          <h3 class="font-semibold mb-2">Update Status</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="s in allowedStatuses"
              :key="s"
              class="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition"
              @click="updateStatus(s)"
            >
              {{ statusLabel(s) }}
            </button>
          </div>
        </div>

        <!-- Buyer Token Input -->
        <div v-if="isBuyer && transaction.status === 'validating'">
          <h3 class="font-semibold mb-2">Masukkan Token</h3>
          <div class="space-y-4">
            <div v-for="(item, index) in transaction.items" :key="index">
              <div class="mb-1 font-medium">{{ item.name }} <span class="text-xs text-gray-400">({{ item.quantity }} pcs)</span></div>
              <div class="flex flex-col gap-4">
                <div v-for="n in item.quantity" :key="n" class="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col items-stretch">
                  <input
                    v-model="tokens[item.name][n-1]"
                    placeholder="Masukkan token"
                    class="border p-2 rounded w-full focus:ring-2 focus:ring-blue-300 mb-2"
                  />
                  <div class="flex gap-2 flex-wrap">
                    <!-- Styled file upload button -->
                    <label class="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded shadow cursor-pointer hover:bg-blue-600 transition text-xs font-semibold gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
                      Upload Gambar QR
                      <input type="file" accept="image/*" class="hidden" @change="e => onPlainFileInputChange(e, item.name, n-1)" />
                    </label>
                    <!-- Camera capture button -->
                    <label class="inline-flex items-center px-3 py-1 bg-green-500 text-white rounded shadow cursor-pointer hover:bg-green-600 transition text-xs font-semibold gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7h2a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v2m0 0h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z" /></svg>
                      Ambil Foto dari Kamera
                      <input type="file" accept="image/*" capture="environment" class="hidden" @change="e => onPlainFileInputChange(e, item.name, n-1)" />
                    </label>
                    <!-- Live QR Scanner button -->
                    <button type="button" class="inline-flex items-center px-3 py-1 bg-purple-500 text-white rounded shadow hover:bg-purple-600 transition text-xs font-semibold gap-2" @click="openLiveScanner(item.name, n-1)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A2 2 0 0020 6.382V5a2 2 0 00-2-2h-1.382a2 2 0 00-1.342.553L13 5m2 5v6m0 0l-4.553 2.276A2 2 0 0110 17.618V19a2 2 0 002 2h1.382a2 2 0 001.342-.553L15 19m-2-5V8" /></svg>
                      Scan QR Live
                    </button>
                  </div>
                  <div v-if="qrDecodeError[item.name] && qrDecodeError[item.name][n-1]" class="text-red-500 text-xs mt-1">{{ qrDecodeError[item.name][n-1] }}</div>
                </div>
              </div>
            </div>
          </div>
          <button
            @click="submitTokens"
            class="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
          >
            Kirim Token
          </button>
        </div>

        <!-- Record to Blockchain -->
        <div v-if="transaction.status === 'completed' && isVendor">
          <button
            @click="recordToBlockchain"
            class="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition font-semibold"
          >
            Record to Blockchain
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-else class="space-y-4 animate-pulse">
      <div class="h-8 bg-gray-200 rounded w-1/2"></div>
      <div class="h-6 bg-gray-200 rounded w-1/3"></div>
      <div class="h-40 bg-gray-100 rounded"></div>
      <div class="h-10 bg-gray-200 rounded w-1/4"></div>
    </div>

    <!-- ZXing Live QR Scanner Modal -->
    <div v-if="showLiveScanner" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative flex flex-col items-center">
        <button @click="closeLiveScanner" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        <h2 class="text-xl font-bold mb-4 text-purple-700">Scan QR Code</h2>
        <video ref="videoRef" class="rounded-lg border border-purple-200 shadow-sm w-full max-w-xs" autoplay muted playsinline></video>
        <div class="text-xs text-gray-500 mt-2">Arahkan kamera ke QR code untuk mengisi token.</div>
        <div v-if="liveScannerError" class="text-red-500 text-xs mt-2">{{ liveScannerError }}</div>
        <button @click="closeLiveScanner" class="mt-4 px-3 py-1 bg-gray-300 rounded">Stop</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/utils/axios'
import { QrcodeDropZone } from 'vue-qrcode-reader'
import { BrowserQRCodeReader } from '@zxing/browser'
import { formatCurrency, formatDateTime } from '@/utils/formatters'

const route = useRoute()
const transactionId = route.params.id as string

interface TransactionItem {
  name: string;
  quantity: number;
  tokens: string[];
}

interface User {
  _id: string;
  name: string;
}

interface Transaction {
  _id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  request?: { judul?: string };
  vendor?: User;
  buyer?: User;
  items: TransactionItem[];
}

const transaction = ref<Transaction | null>(null)
const currentUser = ref<User | null>(null)
const tokens = ref<Record<string, string[]>>({})  // Store the tokens inputted by the buyer

const qrImagePreview = ref<string | null>(null)
const qrDecodeError = ref<Record<string, string[]>>({})

const showLiveScanner = ref(false)
const liveScannerTarget = ref<{ itemName: string, idx: number } | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const liveScannerError = ref('')
let zxingControls: any = null

const getTransaction = async () => {
  try {
    const res = await axios.get(`/transactions/${transactionId}`)
    transaction.value = res.data.transaction
    // Initialize tokens array for each item based on its quantity
    if (transaction.value) {
      transaction.value.items.forEach(item => {
        tokens.value[item.name] = Array(item.quantity).fill('') // initialize with empty string
      })
    }
  } catch (err) {
    console.error(err)
  }
}

const getCurrentUser = async () => {
  try {
    const res = await axios.get('/auth/me')
    currentUser.value = res.data.user
  } catch (err) {
    console.error(err)
  }
}

const updateStatus = async (newStatus: string) => {
  if (!transaction.value) return
  try {
    const res = await axios.patch(`/transactions/${transaction.value._id}/status`, {
      status: newStatus
    })
    transaction.value.status = res.data.transaction.status
    alert('Status diperbarui!')
  } catch (err) {
    console.error(err)
    alert('Gagal memperbarui status')
  }
}

const submitTokens = async () => {
  if (!transaction.value) return
  
  // Flatten tokens to ensure they are individual tokens in an array
  const tokenList = Object.values(tokens.value).flat();

  try {
    const res = await axios.post(`/transactions/${transaction.value._id}/validate`, { tokens: tokenList });
    alert('Token berhasil divalidasi!');
    transaction.value.status = res.data.transaction.status;
  } catch (err: unknown) {
    console.error('Error while submitting tokens:', err instanceof Error ? err.message : 'Unknown error');
    alert('Gagal mengirim token');
  }
}

const recordToBlockchain = async () => {
  if (!transaction.value) return

  try {
    const res = await axios.post(`/blockchain/record/${transaction.value._id}`);
    alert('Transaksi berhasil dicatat di blockchain!');
  } catch (err: unknown) {
    if (typeof err === 'object' && err && 'response' in err && (err as any).response?.data) {
      console.error('Error while recording transaction to blockchain:', (err as any).response.data);
    } else {
      console.error('Unknown error while recording transaction to blockchain:', err);
    }
    alert('Gagal mencatat transaksi ke blockchain');
  }
}

const allowedStatuses = ['in_progress', 'shipped', 'validating', 'completed', 'cancelled']

onMounted(() => {
  getTransaction()
  getCurrentUser()
})

const isVendor = computed(() => transaction.value?.vendor?._id === currentUser.value?._id)
const isBuyer = computed(() => transaction.value?.buyer?._id === currentUser.value?._id)

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

// Handle QR code scan
function onQrScanned(token: string) {
  qrDecodeError.value = {}
  // Try to fill the first empty token input for any item
  if (!transaction.value) return
  for (const item of transaction.value.items) {
    const arr = tokens.value[item.name]
    const emptyIdx = arr.findIndex(t => !t)
    if (emptyIdx !== -1) {
      arr[emptyIdx] = token
      return
    }
  }
}

// Minimal debug for plain file input
async function onTestFileInputChange(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || !files[0]) return
  try {
    const result = await decodeQrWithZxing(files[0])
    alert('[DEBUG] Decoded: ' + result)
  } catch (err) {
    alert('[DEBUG] Error: ' + err)
  } finally {
    input.value = ''
  }
}

async function onPlainFileInputChange(event: Event, itemName: string, idx: number) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || !files[0]) return
  try {
    const result = await decodeQrWithZxing(files[0])
    tokens.value[itemName][idx] = result
    setQrDecodeError(itemName, idx, '')
  } catch (err) {
    setQrDecodeError(itemName, idx, 'Gagal mendeteksi QR code dari gambar.')
  } finally {
    input.value = ''
  }
}

function setQrDecodeError(itemName: string, idx: number, msg: string) {
  if (!qrDecodeError.value[itemName]) qrDecodeError.value[itemName] = []
  qrDecodeError.value[itemName][idx] = msg
}

async function decodeQrWithZxing(file: File): Promise<string> {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const codeReader = new BrowserQRCodeReader()
        const img = new window.Image()
        img.onload = async () => {
          try {
            const result = await codeReader.decodeFromImageElement(img)
            resolve(result.getText())
          } catch (err) {
            reject(err)
          }
        }
        img.onerror = reject
        img.src = reader.result as string
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function onTestDropZoneDecode(result: string) {
  alert('[DEBUG] Decoded: ' + result)
}

function onTestDropZoneError(e: unknown) {
  alert('[DEBUG] Error: ' + (e instanceof Error ? e.message : String(e)))
}

function openLiveScanner(itemName: string, idx: number) {
  liveScannerTarget.value = { itemName, idx }
  showLiveScanner.value = true
  liveScannerError.value = ''
  nextTick(() => startZXingScanner())
}
function closeLiveScanner() {
  showLiveScanner.value = false
  liveScannerTarget.value = null
  stopZXingScanner()
  liveScannerError.value = ''
}
async function startZXingScanner() {
  if (!videoRef.value) return
  try {
    const codeReader = new BrowserQRCodeReader()
    zxingControls = await codeReader.decodeFromVideoDevice(
      undefined,
      videoRef.value,
      (res, err) => {
        if (res && liveScannerTarget.value) {
          tokens.value[liveScannerTarget.value.itemName][liveScannerTarget.value.idx] = res.getText()
          setQrDecodeError(liveScannerTarget.value.itemName, liveScannerTarget.value.idx, '')
          closeLiveScanner()
        }
        if (err && err.name !== 'NotFoundException') {
          liveScannerError.value = err.message
        }
      }
    )
  } catch (e: unknown) {
    liveScannerError.value = e instanceof Error ? e.message : String(e)
  }
}
function stopZXingScanner() {
  if (zxingControls) {
    zxingControls.stop()
    zxingControls = null
  }
}
onBeforeUnmount(() => {
  stopZXingScanner()
})
</script>
