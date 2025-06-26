<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Offers for Request</h1>
            <p class="mt-1 text-sm text-gray-600">
              Review and manage offers for your procurement request
            </p>
          </div>
          <div class="mt-4 sm:mt-0">
            <BaseButton
              @click="$router.push(`/request/${requestId}`)"
              variant="ghost"
              size="lg"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Request
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
      <div v-else-if="offers.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No offers yet</h3>
        <p class="mt-1 text-sm text-gray-500">
          No suppliers have submitted offers for this request yet.
        </p>
      </div>

      <!-- Offers Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="offer in offers"
          :key="offer._id"
          class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div class="p-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-900">
                  {{ offer.supplier?.name || 'Unknown Supplier' }}
                </span>
              </div>
              <StatusBadge :status="offer.status" />
            </div>

            <!-- Offer Details -->
            <div class="space-y-3">
              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>{{ offer.items.length }} items</span>
              </div>

              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span class="font-semibold text-green-600">
                  {{ formatCurrency(getTotalOffer(offer.items)) }}
                </span>
              </div>

              <div v-if="offer.deliveryTime" class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ offer.deliveryTime }} days delivery</span>
              </div>

              <div class="flex items-center text-sm text-gray-600">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ formatDate(offer.createdAt) }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-6 flex space-x-3">
              <BaseButton
                @click="$router.push(`/offer/${offer._id}`)"
                variant="primary"
                size="sm"
                full-width
              >
                View Details
              </BaseButton>
              <BaseButton
                v-if="offer.status === 'pending'"
                @click="handleAcceptOffer(offer._id)"
                variant="success"
                size="sm"
                full-width
                :loading="acceptingOffer === offer._id"
              >
                Accept Offer
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="offers.length > 0" class="mt-8 flex justify-center">
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
import { useRoute, useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notification'
import { offerService } from '@/services'
import BaseButton from '@/components/ui/BaseButton.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { formatDate, formatCurrency } from '@/utils/formatters'
import type { Offer } from '@/types'

const route = useRoute()
const router = useRouter()
const notificationStore = useNotificationStore()

const requestId = route.params.id as string

// State
const offers = ref<Offer[]>([])
const loading = ref(true)
const currentPage = ref(1)
const itemsPerPage = 9
const acceptingOffer = ref<string | null>(null)

// Computed
const totalPages = computed(() => Math.ceil(offers.value.length / itemsPerPage))

// Methods
const fetchOffers = async () => {
  loading.value = true
  try {
    const response = await offerService.getOffersForRequest(requestId, {
      page: currentPage.value,
      limit: itemsPerPage,
    })
    offers.value = response.data
  } catch (error) {
    console.error('Failed to load offers:', error)
    notificationStore.error('Failed to load offers')
  } finally {
    loading.value = false
  }
}

const getTotalOffer = (items: any[]) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
}

const handleAcceptOffer = async (offerId: string) => {
  acceptingOffer.value = offerId
  try {
    await offerService.acceptOffer(offerId)
    notificationStore.success('Offer accepted successfully')
    // Refresh offers list
    await fetchOffers()
  } catch (error) {
    console.error('Failed to accept offer:', error)
    notificationStore.error('Failed to accept offer')
  } finally {
    acceptingOffer.value = null
  }
}

// Lifecycle
onMounted(() => {
  fetchOffers()
})
</script>
  