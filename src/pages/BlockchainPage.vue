<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8 text-center text-blue-700 tracking-tight">Blockchain Explorer</h1>
      <div v-if="blocks.length" class="overflow-x-auto pb-6">
        <div class="flex space-x-6 min-w-max">
          <BlockItem
            v-for="(block, index) in blocks"
            :key="block.index"
            :block="block"
            :index="index"
            :mining-steps="miningSteps"
            @show-mining-steps="handleShowMiningSteps"
          />
          <!-- Visual connector between blocks -->
          <!-- Optionally, add arrows or lines here for better chain visualization -->
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center py-24">
        <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-xl font-semibold text-gray-500">Memuat blockchain...</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from '@/utils/axios';
import BlockItem from '@/components/BlockItem.vue';
import { mineBlockSteps } from '@/utils/mining';
import type { BlockchainBlock, MiningStep } from '@/types/blockchain';

const blocks = ref<BlockchainBlock[]>([]);
const miningSteps = ref<{ [key: number]: MiningStep[] }>({});

const getBlockchain = async () => {
  try {
    const res = await axios.get('/blockchain/');
    blocks.value = res.data.chain;
  } catch (err) {
    console.error('Error fetching blockchain:', err);
  }
};

const handleShowMiningSteps = (blockIndex: number) => {
  if (blockIndex < 0 || blockIndex >= blocks.value.length) {
    console.error('Block index out of range:', blockIndex);
    return;
  }
  const block = JSON.parse(JSON.stringify(blocks.value[blockIndex]));
  if (!block) {
    console.error('Block not found for index:', blockIndex);
    return;
  }
  if (block.data && Array.isArray(block.data.items)) {
    block.data.items = block.data.items.map((item: any) => {
      let tokens = Array.isArray(item.tokens) ? [...item.tokens] : [];
      if (item.quantity && tokens.length < item.quantity) {
        const fillToken = item.token || '';
        while (tokens.length < item.quantity) {
          tokens.push(fillToken);
        }
      }
      return {
        ...item,
        tokens,
        token: tokens[0] || item.token || ''
      };
    });
  }
  const previousBlock = blockIndex > 0 ? blocks.value[blockIndex - 1] : null;
  const previousHash = previousBlock ? previousBlock.hash : "0000000000000000000000000000000000000000000000000000000000000000";
  try {
    const steps = mineBlockSteps(block, previousHash, blocks.value);
    miningSteps.value[block.index] = steps;
  } catch (error) {
    console.error('Error during mining simulation:', error);
    miningSteps.value[block.index] = [{
      nonce: 0,
      hash: '',
      description: `Error: ${error.message}`,
      messagePadding: '',
      messageScheduling: '',
      messageCompression: '',
      finalHash: ''
    }];
  }
};

onMounted(() => {
  getBlockchain();
});
</script>