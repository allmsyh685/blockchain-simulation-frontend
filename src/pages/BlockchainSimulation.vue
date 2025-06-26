<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8 text-center text-blue-700 tracking-tight">Blockchain Network Simulation <span class="text-base font-normal text-gray-400">(10 Peers)</span></h1>
      <!-- Network Status -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl shadow">
        <div class="text-lg font-semibold flex items-center gap-3">
          <span>Status Jaringan:</span>
          <span :class="getNetworkStatusClass() + ' px-3 py-1 rounded-full font-bold text-sm'">
            {{ getNetworkStatus() }}
          </span>
        </div>
        <div class="flex gap-6 items-center">
          <span class="text-sm">Peers Valid: <span class="text-green-600 font-bold">{{ validPeersCount }}</span>/10</span>
          <span class="text-sm">Peers Invalid: <span class="text-red-600 font-bold">{{ invalidPeersCount }}</span>/10</span>
          <button @click="resetAllPeers" class="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition font-semibold flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5 9A9 9 0 0119 15.582M19 15A9 9 0 015 8.418"></path></svg>
            Reset All Peers
          </button>
        </div>
      </div>
      <!-- Error State -->
      <div v-if="error" class="text-center py-8 bg-red-100 border border-red-300 rounded-lg mb-6">
        <p class="text-lg text-red-600 mb-2">Error: {{ error }}</p>
        <button @click="initializePeers" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Retry Loading</button>
      </div>
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-lg">Memuat blockchain dari server...</p>
      </div>
      <!-- Blockchain Network Grid -->
      <div v-else-if="!error" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <div v-for="(peer, peerIndex) in peers" :key="peerIndex" class="rounded-2xl shadow-lg p-6 border-2 transition relative bg-white"
            :class="peer.isValid ? 'border-green-400' : 'border-red-400'">
            <!-- Peer Header -->
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-2">
                <span class="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 text-white flex items-center justify-center font-bold text-lg shadow">{{ peerIndex + 1 }}</span>
                <span class="text-lg font-bold">Peer {{ peerIndex + 1 }}</span>
                <span :class="peer.isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-2 py-0.5 rounded-full text-xs font-bold ml-2">{{ peer.isValid ? 'Valid' : 'Invalid' }}</span>
              </div>
              <div class="flex gap-2">
                <button @click="validatePeer(peerIndex)" class="bg-purple-500 text-white px-3 py-1 text-sm rounded hover:bg-purple-600 transition font-semibold">Validate</button>
                <button @click="resetPeer(peerIndex)" class="bg-gray-500 text-white px-3 py-1 text-sm rounded hover:bg-gray-600 transition font-semibold">Reset Peer</button>
              </div>
            </div>
            <!-- Blocks Horizontal Layout -->
            <div class="flex gap-4 overflow-x-auto pb-2">
              <div v-for="(block, blockIndex) in peer.blockchain" :key="`peer${peerIndex}-block${blockIndex}`"
                class="min-w-[340px] max-w-xs bg-gray-50 border rounded-xl p-4 shadow flex flex-col transition hover:shadow-xl"
                :class="getBlockClass(block, blockIndex, peer.blockchain)">
                <!-- Block Header -->
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span class="inline-block w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 text-white flex items-center justify-center font-bold text-base shadow">{{ block.index }}</span>
                    <span class="text-xs font-semibold text-blue-700 uppercase tracking-wider">Block</span>
                  </div>
                  <span v-if="blockIndex === 0" class="px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 text-xs font-bold">Genesis</span>
                  <span v-else :class="getBlockClass(block, blockIndex, peer.blockchain)" class="px-2 py-0.5 rounded text-xs font-bold">{{ getBlockClass(block, blockIndex, peer.blockchain) === 'bg-green-100 border-green-300' ? 'Valid' : 'Invalid' }}</span>
                </div>
                <!-- Editable Fields -->
                <div class="space-y-2 text-xs">
                  <div>
                    <label class="font-semibold text-gray-700">Index:</label>
                    <input v-model.number="block.index" @input="onBlockFieldChange(peerIndex, blockIndex)" type="number" class="w-full p-1 border rounded text-xs" />
                  </div>
                  <div>
                    <label class="font-semibold text-gray-700">Timestamp:</label>
                    <input v-model="block.timestamp" @input="onBlockFieldChange(peerIndex, blockIndex)" type="text" class="w-full p-1 border rounded text-xs" />
                  </div>
                  <div v-if="block.index > 0">
                    <div class="mb-2">
                      <label class="font-semibold text-gray-700">Transaction ID:</label>
                      <input v-model="block.data.transactionId" @input="onBlockFieldChange(peerIndex, blockIndex)" type="text" class="w-full p-1 border rounded text-xs" />
                    </div>
                    <div class="mb-2">
                      <label class="font-semibold text-gray-700">Buyer:</label>
                      <input v-model="block.data.buyer" @input="onBlockFieldChange(peerIndex, blockIndex)" type="text" class="w-full p-1 border rounded text-xs" />
                    </div>
                    <div class="mb-2">
                      <label class="font-semibold text-gray-700">Vendor:</label>
                      <input v-model="block.data.vendor" @input="onBlockFieldChange(peerIndex, blockIndex)" type="text" class="w-full p-1 border rounded text-xs" />
                    </div>
                    <div class="mb-2 p-2 border border-gray-300 rounded bg-white">
                      <label class="font-semibold text-gray-700 block mb-2">Items:</label>
                      <div v-for="(item, itemIndex) in block.data.items" :key="itemIndex" class="mb-2 p-2 bg-gray-50 rounded border">
                        <div class="flex justify-between items-center mb-2">
                          <span class="font-medium text-xs">Item {{ itemIndex + 1 }}</span>
                          <button @click="removeItem(peerIndex, blockIndex, itemIndex)" class="text-red-500 hover:text-red-700 text-xs">Remove</button>
                        </div>
                        <div class="space-y-1">
                          <div>
                            <label class="text-xs text-gray-600">Nama Item:</label>
                            <input v-model="item.name" @input="onBlockFieldChange(peerIndex, blockIndex)" type="text" class="w-full p-1 border rounded text-xs" placeholder="Nama item" />
                          </div>
                          <div>
                            <label class="text-xs text-gray-600">Token Item (Utama):</label>
                            <input v-model="item.token" @input="onBlockFieldChange(peerIndex, blockIndex)" type="text" class="w-full p-1 border rounded text-xs" placeholder="Token utama (pertama)" />
                          </div>
                          <div>
                            <label class="text-xs text-gray-600">Tokens (Array):</label>
                            <div v-for="(token, tIdx) in item.tokens || []" :key="tIdx" class="flex items-center mb-1">
                              <input v-model="item.tokens[tIdx]" @input="onBlockFieldChange(peerIndex, blockIndex)" type="text" class="w-full p-1 border rounded text-xs mr-2" placeholder="Token ke-{{ tIdx + 1 }}" />
                              <button @click="item.tokens && item.tokens.splice(tIdx, 1); onBlockFieldChange(peerIndex, blockIndex)" class="text-red-500 text-xs ml-1">Hapus</button>
                            </div>
                            <button @click="() => { if (!item.tokens) item.tokens = []; item.tokens.push(''); onBlockFieldChange(peerIndex, blockIndex) }" class="text-xs bg-blue-100 px-2 py-1 rounded mt-1">Tambah Token</button>
                          </div>
                          <div>
                            <label class="text-xs text-gray-600">Quantity:</label>
                            <input v-model.number="item.quantity" @input="onBlockFieldChange(peerIndex, blockIndex)" type="number" class="w-full p-1 border rounded text-xs" placeholder="Jumlah" />
                          </div>
                          <div>
                            <label class="text-xs text-gray-600">Price:</label>
                            <input v-model.number="item.price" @input="onBlockFieldChange(peerIndex, blockIndex)" type="number" class="w-full p-1 border rounded text-xs" placeholder="Harga per item" />
                          </div>
                        </div>
                      </div>
                      <button @click="addItem(peerIndex, blockIndex)" class="w-full bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs mt-2">Add Item</button>
                    </div>
                    <div class="mb-2">
                      <label class="font-semibold text-gray-700">Total Amount:</label>
                      <input v-model.number="block.data.total" @input="onBlockFieldChange(peerIndex, blockIndex)" type="number" class="w-full p-1 border rounded text-xs" />
                    </div>
                  </div>
                  <div>
                    <label class="font-semibold text-gray-700">Previous Hash:</label>
                    <input v-model="block.previousHash" @input="onBlockFieldChange(peerIndex, blockIndex)" type="text" class="w-full p-1 border rounded text-xs font-mono" />
                  </div>
                  <div>
                    <label class="font-semibold text-gray-700">Nonce:</label>
                    <input v-model.number="block.nonce" @input="onBlockFieldChange(peerIndex, blockIndex)" type="number" class="w-full p-1 border rounded text-xs" />
                  </div>
                  <div>
                    <label class="font-semibold text-gray-700">Hash:</label>
                    <div class="w-full p-1 bg-gray-100 border rounded text-xs font-mono break-all">{{ block.hash }}</div>
                  </div>
                  <div class="mt-3">
                    <button @click="mineBlock(peerIndex, blockIndex)" :disabled="miningStatus[`${peerIndex}-${blockIndex}`]" class="w-full bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 disabled:bg-gray-400 text-sm">
                      {{ miningStatus[`${peerIndex}-${blockIndex}`] ? 'Mining...' : 'Mine Block' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import httpService from '@/services/http';

interface BlockchainItem {
  name: string;
  token: string;
  tokens?: string[];
  quantity: number;
  price: number;
}

interface BlockchainBlock {
  index: number;
  timestamp: string;
  data: {
    transactionId?: string;
    buyer?: string;
    vendor?: string;
    items?: BlockchainItem[];
    total?: number;
  };
  previousHash: string;
  nonce: number;
  hash: string;
}

interface Peer {
  blockchain: BlockchainBlock[];
  isValid: boolean;
}

const loading = ref(true);
const error = ref<string | null>(null);
const peers = ref<Peer[]>([]);
const originalBlockchain = ref<BlockchainBlock[]>([]);
const miningStatus = reactive<{ [key: string]: boolean }>({});

// Computed properties untuk network status
const validPeersCount = computed(() => 
  peers.value.filter(peer => peer.isValid).length
);

const invalidPeersCount = computed(() => 
  peers.value.filter(peer => !peer.isValid).length
);

const getNetworkStatus = () => {
  if (validPeersCount.value === 10) return "Semua Peer Sinkron";
  if (validPeersCount.value === 0) return "Jaringan Tidak Stabil";
  return `${invalidPeersCount.value} Peer Tidak Sinkron`;
};

const getNetworkStatusClass = () => {
  if (validPeersCount.value === 10) return "text-green-600";
  if (validPeersCount.value === 0) return "text-red-600";
  return "text-yellow-600";
};

// SHA-256 implementation
const sha256 = async (message: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Initialize blockchain network
const initializePeers = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const data = await httpService.get('/blockchain/');
    
    if (!data.chain || !Array.isArray(data.chain)) {
      throw new Error('Invalid blockchain data format');
    }
    
    // Ensure data structure is complete
    const processedChain = data.chain.map((block: any) => ({
      index: block.index || 0,
      timestamp: block.timestamp || new Date().toISOString(),
      data: {
        transactionId: block.data?.transactionId || '',
        buyer: block.data?.buyer || '',
        vendor: block.data?.vendor || '',
        items: block.data?.items || [],
        total: block.data?.total || 0,
        ...block.data
      },
      previousHash: block.previousHash || '',
      nonce: block.nonce || 0,
      hash: block.hash || ''
    }));
    
    originalBlockchain.value = JSON.parse(JSON.stringify(processedChain));
    
    // Create 10 identical peers
    peers.value = Array.from({ length: 10 }, () => ({
      blockchain: JSON.parse(JSON.stringify(processedChain)),
      isValid: true
    }));
    
    loading.value = false;
  } catch (err) {
    console.error('Error fetching blockchain:', err);
    error.value = err instanceof Error ? err.message : 'Unknown error occurred';
    loading.value = false;
  }
};

// Calculate hash for a block
const calculateBlockHash = async (block: BlockchainBlock): Promise<string> => {
  const dataString = JSON.stringify(block.data);
  const hashInput = `${block.index}${block.nonce}${dataString}${block.previousHash}`;
  console.log(hashInput);
  return await sha256(hashInput);
};

// Check if a single block is valid
const isBlockValid = async (block: BlockchainBlock, blockIndex: number, blockchain: BlockchainBlock[]): Promise<boolean> => {
  try {
    // Check hash
    const calculatedHash = await calculateBlockHash(block);
    if (calculatedHash !== block.hash) return false;
    
    // Check difficulty (3 leading zeros)
    if (!block.hash.startsWith('000')) return false;
    
    // Check previous hash (except for genesis block)
    if (blockIndex > 0) {
      const previousBlock = blockchain[blockIndex - 1];
      if (block.previousHash !== previousBlock.hash) return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating block:', error);
    return false;
  }
};

// Synchronous version for template usage
const isBlockValidSync = (block: BlockchainBlock, blockIndex: number, blockchain: BlockchainBlock[]): boolean => {
  // Simple hash validation without async
  if (!block.hash.startsWith('000')) return false;
  // Check previous hash (except for genesis block)
  if (blockIndex > 0) {
    const previousBlock = blockchain[blockIndex - 1];
    if (block.previousHash !== previousBlock.hash) return false;
    // If previous block is invalid, this block is also invalid
    if (!isBlockValidSync(previousBlock, blockIndex - 1, blockchain)) return false;
  }
  return true;
};

// Check if entire peer blockchain is valid
const isPeerValid = async (peer: Peer): Promise<boolean> => {
  for (let i = 0; i < peer.blockchain.length; i++) {
    const isValid = await isBlockValid(peer.blockchain[i], i, peer.blockchain);
    if (!isValid) return false;
  }
  return true;
};

// Get CSS class for block based on validity (cascading invalidation)
const getBlockClass = (block: BlockchainBlock, blockIndex: number, blockchain: BlockchainBlock[]): string => {
  const isValid = isBlockValidSync(block, blockIndex, blockchain);
  return isValid ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300';
};

// Handle field changes
const onBlockFieldChange = async (peerIndex: number, blockIndex: number) => {
  const block = peers.value[peerIndex].blockchain[blockIndex];
  
  // Recalculate hash
  block.hash = await calculateBlockHash(block);
  
  // Update peer validity
  peers.value[peerIndex].isValid = await isPeerValid(peers.value[peerIndex]);
  
  // Force reactivity update
  peers.value = [...peers.value];
};

// Add new item to block
const addItem = (peerIndex: number, blockIndex: number) => {
  const block = peers.value[peerIndex].blockchain[blockIndex];
  if (!block.data.items) {
    block.data.items = [];
  }
  
  block.data.items.push({
    name: '',
    token: '',
    quantity: 1,
    price: 0
  });
  
  onBlockFieldChange(peerIndex, blockIndex);
};

// Remove item from block
const removeItem = (peerIndex: number, blockIndex: number, itemIndex: number) => {
  const block = peers.value[peerIndex].blockchain[blockIndex];
  if (block.data.items) {
    block.data.items.splice(itemIndex, 1);
    onBlockFieldChange(peerIndex, blockIndex);
  }
};

// Mine a block (find valid nonce)
const mineBlock = async (peerIndex: number, blockIndex: number) => {
  const key = `${peerIndex}-${blockIndex}`;
  miningStatus[key] = true;
  
  const block = peers.value[peerIndex].blockchain[blockIndex];
  let nonce = 0;
  let hash = '';
  
  // Mining simulation with delay for UI
  while (true) {
    const dataString = JSON.stringify(block.data);
    const hashInput = `${block.index}${nonce}${dataString}${block.previousHash}`;
    hash = await sha256(hashInput);
    
    if (hash.startsWith('000')) {
      block.nonce = nonce;
      block.hash = hash;
      
      // Update peer validity
      peers.value[peerIndex].isValid = await isPeerValid(peers.value[peerIndex]);
      break;
    }
    
    nonce++;
    
    // Add delay every 100 iterations to prevent UI blocking
    if (nonce % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    // Prevent infinite loop
    if (nonce > 100000) {
      console.warn('Mining stopped after 100000 attempts');
      break;
    }
  }
  
  miningStatus[key] = false;
  
  // Force reactivity update
  peers.value = [...peers.value];
};

// Validate specific peer
const validatePeer = async (peerIndex: number) => {
  peers.value[peerIndex].isValid = await isPeerValid(peers.value[peerIndex]);
  // Force reactivity update
  peers.value = [...peers.value];
};

// Reset specific peer
const resetPeer = (peerIndex: number) => {
  peers.value[peerIndex].blockchain = JSON.parse(JSON.stringify(originalBlockchain.value));
  peers.value[peerIndex].isValid = true;
};

// Reset all peers
const resetAllPeers = () => {
  peers.value.forEach((peer, index) => {
    resetPeer(index);
  });
};

onMounted(() => {
  initializePeers();
});
</script> 