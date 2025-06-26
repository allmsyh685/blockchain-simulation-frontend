<template>
    <div>
      <p><strong>Transaction ID:</strong> {{ getTransactionId() }}</p>
      <p><strong>Buyer:</strong> {{ data.buyer }}</p>
      <p><strong>Vendor:</strong> {{ data.vendor }}</p>
      <p><strong>Total:</strong> Rp {{ formatCurrency(data.total) }}</p>

      <!-- Debug info - hapus di production -->
      <div v-if="showDebug" class="mt-4 p-4 bg-gray-100 border rounded">
        <h4 class="font-bold">Debug Info:</h4>
        <pre class="text-xs">{{ JSON.stringify(data, null, 2) }}</pre>
        <p><strong>Items found:</strong> {{ getItems().length }}</p>
        <div v-if="getItems().length > 0">
          <p><strong>First item structure:</strong></p>
          <pre class="text-xs">{{ JSON.stringify(getItems()[0], null, 2) }}</pre>
        </div>
      </div>

      <div v-if="getItems().length" v-for="(item, idx) in getItems()" :key="idx" class="mt-4 p-4 border-t">
        <h3 class="font-semibold text-lg">
          Item {{ idx + 1 }}: {{ item.name || 'Nama tidak tersedia' }}
        </h3>
        <p><strong>Quantity:</strong> {{ item.quantity || 0 }} pcs</p>
        <p><strong>Price:</strong> Rp {{ formatCurrency(item.price || 0) }}</p>
        

        <p><strong>Tokens:</strong></p>
        <div v-if="getTokens(item).length > 0">
          <ul class="list-disc list-inside ml-4">
            <li v-for="(token, i) in getTokens(item)" :key="i" class="text-sm">
              {{ token }}
            </li>
          </ul>
        </div>
        <p v-else class="text-gray-500 italic ml-4">Tidak ada tokens</p>
      </div>
      
      <div v-else class="mt-4 p-4 border-t text-gray-500 italic">
        Tidak ada items ditemukan
      </div>
    </div>
</template>

<script setup lang="ts">
import { formatCurrency} from '@/utils/formatters';
import { ref } from 'vue';

interface Props {
  data: any;
}

const props = defineProps<Props>();

// Debug flag - set to false for production
const showDebug = ref(false);

// Function untuk mengambil transaction ID yang benar
const getTransactionId = () => {
  if (typeof props.data.transactionId === 'object' && props.data.transactionId?._id) {
    return props.data.transactionId._id;
  }
  return props.data.transactionId;
};

// Function untuk mengambil items yang benar
const getItems = () => {
  // Cek jika transactionId adalah object yang populated
  if (props.data.transactionId && 
      typeof props.data.transactionId === 'object' && 
      props.data.transactionId.items && 
      Array.isArray(props.data.transactionId.items)) {
    return props.data.transactionId.items;
  }
  
  // Fallback ke data.items
  if (props.data.items && Array.isArray(props.data.items)) {
    return props.data.items;
  }
  
  return [];
};

// Function untuk mengambil tokens dari item
const getTokens = (item: any) => {
  // Console log untuk debugging
  console.log('Item:', item);
  console.log('item.tokens:', item.tokens);
  console.log('item.token:', item.token);
  
  // Cek berbagai kemungkinan struktur token
  if (item.tokens) {
    // Jika tokens adalah array
    if (Array.isArray(item.tokens)) {
      return item.tokens;
    }
    // Jika tokens adalah string tunggal
    if (typeof item.tokens === 'string') {
      return [item.tokens];
    }
  }
  
  // Cek jika menggunakan field 'token' (singular)
  if (item.token) {
    if (Array.isArray(item.token)) {
      return item.token;
    }
    if (typeof item.token === 'string') {
      return [item.token];
    }
  }
  
  // Cek kemungkinan struktur nested lainnya
  if (item._id && item.name && item.quantity) {
    // Mungkin token ada di level yang berbeda
    const possibleTokenFields = ['tokenId', 'tokenIds', 'productToken', 'productTokens'];
    for (const field of possibleTokenFields) {
      if (item[field]) {
        if (Array.isArray(item[field])) {
          return item[field];
        }
        if (typeof item[field] === 'string') {
          return [item[field]];
        }
      }
    }
  }
  
  return [];
};
</script>