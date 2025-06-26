<template>
    <div>
      <button @click="$emit('show-steps')" class="bg-blue-500 text-white px-4 py-2 rounded mt-4">
        Tampilkan Langkah Mining
      </button>
      <div v-if="miningSteps[blockIndex]" class="mt-4">
        <div v-for="step in miningSteps[blockIndex]" :key="step.nonce" class="mb-4">
          <p class="font-semibold mb-1">{{ step.description }}</p>
          <div class="bg-gray-100 rounded p-2 text-xs font-mono break-all whitespace-pre-line text-justify">
            {{ step.hash }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { MiningStep } from '../types/blockchain';
  
  interface Props {
    blockIndex: number;
    miningSteps: { [key: number]: MiningStep[] };
  }
  
  defineProps<Props>();
  defineEmits(['show-steps']);
  </script>