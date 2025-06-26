<template>
  <div class="relative bg-white border border-gray-200 rounded-2xl shadow-lg p-6 min-w-[340px] max-w-xs flex flex-col transition hover:shadow-2xl">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <span class="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 text-white flex items-center justify-center font-bold text-lg shadow">{{ block.index }}</span>
        <span class="text-xs font-semibold text-blue-700 uppercase tracking-wider">Block</span>
      </div>
      <span v-if="block.index === 0" class="px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 text-xs font-bold">Genesis</span>
      <span v-else class="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-bold">Valid</span>
    </div>
    <div class="mb-2">
      <div class="flex items-center text-xs text-gray-500 mb-1">
        <span class="font-semibold mr-1">Timestamp:</span> {{ block.timestamp }}
      </div>
      <div class="flex items-center text-xs text-gray-500 mb-1">
        <span class="font-semibold mr-1">Hash:</span> <span class="truncate max-w-[180px]">{{ block.hash }}</span>
      </div>
      <div class="flex items-center text-xs text-gray-500 mb-1">
        <span class="font-semibold mr-1">Prev:</span> <span class="truncate max-w-[120px]">{{ block.previousHash }}</span>
      </div>
      <div class="flex items-center text-xs text-gray-500 mb-1">
        <span class="font-semibold mr-1">Nonce:</span> {{ block.nonce }}
      </div>
    </div>
    <div>
      <details class="mb-2">
        <summary class="cursor-pointer text-blue-600 hover:underline font-semibold">Transaction Details</summary>
        <TransactionDetails v-if="block.index > 0 && block.data" :data="block.data" />
      </details>
      <MiningStepsSection
        :block-index="block.index"
        :mining-steps="props.miningSteps || {}"
        @show-steps="$emit('show-mining-steps', index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TransactionDetails from '@/components/TransactionDetails.vue';
import MiningStepsSection from '@/components/MiningStepsSection.vue';
import type { BlockchainBlock, MiningStep } from '../types/blockchain';

interface Props {
  block: BlockchainBlock;
  index: number;
  miningSteps?: { [key: number]: MiningStep[] };
}

const props = defineProps<Props>();
defineEmits(['show-mining-steps']);
</script>