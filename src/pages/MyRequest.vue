<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">My Requests</h1>
            <p class="mt-1 text-sm text-gray-600">
              Manage and track your procurement requests
            </p>
          </div>
          <div class="mt-4 sm:mt-0">
            <BaseButton
              @click="$router.push('/create-request')"
              variant="primary"
              size="lg"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Request
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="requests.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No requests yet</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating your first procurement request.</p>
        <div class="mt-6">
          <BaseButton
            @click="$router.push('/create-request')"
            variant="primary"
            size="sm"
          >
            Create Request
          </BaseButton>
        </div>
      </div>

      <!-- Requests Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="request in requests"
          :key="request._id"
          class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div class="p-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-900">
                  Request #{{ request._id.slice(-6) }}
                </span>
              </div>
              <StatusBadge :status="request.status" />
            </div>

            <!-- Request Details -->
            <div class="space-y-3">
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Deadline: {{ formatDate(request.deadline) }}</span>
              </div>

              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>{{ (request.items || []).length }} items</span>
              </div>

              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span class="font-semibold text-green-600">
                  {{ formatCurrency(getTotalBudget(request.items || [])) }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex space-x-3">
              <BaseButton
                @click="$router.push(`/request/${request._id}`)"
                variant="ghost"
                size="sm"
                full-width
              >
                View Details
              </BaseButton>
              <BaseButton
                @click="$router.push(`/offers/${request._id}`)"
                variant="primary"
                size="sm"
                full-width
              >
                View Offers
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="requests.length > 0" class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <BaseButton
            variant="ghost"
            size="sm"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            Previous
          </BaseButton>
          <span class="text-sm text-gray-700">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <BaseButton
            variant="ghost"
            size="sm"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            Next
          </BaseButton>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import { requestService } from '@/services'
import BaseButton from '@/components/ui/BaseButton.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { formatDate, formatCurrency } from '@/utils/formatters'
import type { ProcurementRequest } from '@/types'

const notificationStore = useNotificationStore()

// State
const requests = ref<ProcurementRequest[]>([])
const loading = ref(true)
const currentPage = ref(1)
const itemsPerPage = 9

// Computed
const totalPages = computed(() => Math.ceil(requests.value.length / itemsPerPage))

// Methods
const fetchMyRequests = async () => {
  loading.value = true
  try {
    const response = await requestService.getMyRequests({
      page: currentPage.value,
      limit: itemsPerPage,
    })
    requests.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Failed to load requests:', error)
    notificationStore.error('Failed to load your requests')
    requests.value = []
  } finally {
    loading.value = false
  }
}

const getTotalBudget = (items: any[]) => {
  if (!Array.isArray(items)) return 0
  return items.reduce((sum, item) => sum + (item.budget * item.quantity), 0)
}

// Lifecycle
onMounted(() => {
  fetchMyRequests()
})
</script>
