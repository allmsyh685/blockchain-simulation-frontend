<template>
  <div
    :class="[
      'bg-white border border-gray-200 rounded-lg p-4 transition-shadow duration-200',
      isClickable ? 'hover:shadow-md cursor-pointer' : 'opacity-60 cursor-not-allowed',
    ]"
    @click="isClickable ? $emit('click') : null"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <!-- Header -->
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="text-sm font-medium text-gray-900">
              Request #{{ request?._id ? request._id.slice(-6) : 'N/A' }}
            </span>
          </div>
          <StatusBadge :status="request?.status || 'unknown'" />
        </div>

        <!-- User Info -->
        <div class="mb-3">
          <p class="text-sm font-medium text-gray-900">{{ request?.user?.name || 'Unknown User' }}</p>
          <p class="text-xs text-gray-500">{{ request?.user?.email || '' }}</p>
        </div>

        <!-- Budget -->
        <div class="mb-3">
          <p class="text-lg font-semibold text-green-600">
            {{ formatCurrency(request?.totalBudget || 0) }}
          </p>
        </div>

        <!-- Items Preview -->
        <div class="space-y-1">
          <div
            v-for="(item, index) in displayItems"
            :key="index"
            class="text-sm text-gray-600 flex items-center"
          >
            <svg class="w-3 h-3 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="truncate">
              {{ item?.name || 'Unknown Item' }} - {{ item?.brand || 'Unknown Brand' }} ({{ item?.quantity || 0 }}x)
            </span>
          </div>
          <div v-if="(request?.items || []).length > 3" class="text-xs text-gray-400">
            +{{ (request?.items || []).length - 3 }} more items
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Deadline: {{ formatDate(request?.deadline || new Date()) }}</span>
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ formatRelativeTime(request?.createdAt || new Date()) }}</span>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="mt-4 flex justify-end space-x-2">
          <button
            v-if="canMakeOffer"
            @click.stop="$emit('make-offer')"
            class="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors duration-200"
          >
            Make Offer
          </button>
          <span
            v-else
            class="px-3 py-1 bg-gray-300 text-gray-600 text-xs rounded cursor-not-allowed"
          >
            Your Request
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { formatCurrency, formatDate, formatRelativeTime } from '@/utils/formatters'
import type { ProcurementRequest } from '@/types'

interface Props {
  request: ProcurementRequest
  canMakeOffer?: boolean
  isClickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canMakeOffer: true,
  isClickable: true,
})

defineEmits<{
  click: []
  'make-offer': []
}>()

const displayItems = computed(() => {
  if (!props.request?.items || !Array.isArray(props.request.items)) {
    return []
  }
  return props.request.items.slice(0, 3)
})
</script> 