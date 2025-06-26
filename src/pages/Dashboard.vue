<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p class="mt-1 text-sm text-gray-600">
              Welcome back, {{ authStore.user?.name }}! Browse all procurement requests and make offers.
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

    <!-- Stats Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Requests"
          :value="stats.totalRequests"
          :change="stats.requestsChange"
          icon="DocumentIcon"
          color="blue"
        />
        <StatsCard
          title="Active Offers"
          :value="stats.activeOffers"
          :change="stats.offersChange"
          icon="CurrencyDollarIcon"
          color="green"
        />
        <StatsCard
          title="Completed Transactions"
          :value="stats.completedTransactions"
          :change="stats.transactionsChange"
          icon="CheckCircleIcon"
          color="purple"
        />
        <StatsCard
          title="Total Budget"
          :value="formatCurrency(stats.totalBudget)"
          :change="stats.budgetChange"
          icon="ChartBarIcon"
          color="yellow"
        />
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Recent Requests -->
        <div class="lg:col-span-2">
          <div class="bg-white shadow-sm rounded-lg border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-medium text-gray-900">All Requests</h2>
                <div class="flex items-center space-x-4">
                  <span class="text-sm text-gray-500">
                    {{ filteredRequests.length }} of {{ recentRequests.length }} requests
                  </span>
                  <router-link
                    to="/my-request"
                    class="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  >
                    View my requests
                  </router-link>
                </div>
              </div>
            </div>
            
            <!-- Filters -->
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Username Search -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Search by User</label>
                  <input
                    v-model="filters.username"
                    type="text"
                    placeholder="Enter username..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    @input="applyFilters"
                  />
                </div>
                
                <!-- Min Budget -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Min Budget</label>
                  <input
                    v-model.number="filters.minBudget"
                    type="number"
                    placeholder="Min amount..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    @input="applyFilters"
                  />
                </div>
                
                <!-- Max Budget -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Max Budget</label>
                  <input
                    v-model.number="filters.maxBudget"
                    type="number"
                    placeholder="Max amount..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    @input="applyFilters"
                  />
                </div>
              </div>
              
              <!-- Clear Filters Button -->
              <div class="mt-3 flex justify-end">
                <button
                  @click="clearFilters"
                  class="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear filters
                </button>
              </div>
            </div>
            
            <div class="p-6">
              <div v-if="loading" class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <div v-else-if="filteredRequests.length === 0" class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{ filters.username || filters.minBudget || filters.maxBudget ? 'Try adjusting your filters.' : 'Get started by creating your first procurement request.' }}
                </p>
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
              <div v-else class="space-y-4">
                <RequestCard
                  v-for="request in filteredRequests"
                  :key="request._id"
                  :request="request"
                  :can-make-offer="request.user._id !== authStore.user?._id"
                  :is-clickable="request.status === 'pending' && request.user._id !== authStore.user?._id"
                  @click="handleRequestClick(request)"
                  @make-offer="handleRequestClick(request)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions & Notifications -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <div class="bg-white shadow-sm rounded-lg border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Quick Actions</h2>
            </div>
            <div class="p-6 space-y-3">
              <BaseButton
                @click="$router.push('/create-request')"
                variant="ghost"
                full-width
                class="justify-start"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Request
              </BaseButton>
              <BaseButton
                @click="$router.push('/my-request')"
                variant="ghost"
                full-width
                class="justify-start"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View My Requests
              </BaseButton>
              <BaseButton
                @click="$router.push('/transactions')"
                variant="ghost"
                full-width
                class="justify-start"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Transactions
              </BaseButton>
              <BaseButton
                @click="$router.push('/blockchain')"
                variant="ghost"
                full-width
                class="justify-start"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Blockchain Explorer
              </BaseButton>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white shadow-sm rounded-lg border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Recent Activity</h2>
            </div>
            <div class="p-6">
              <div v-if="recentActivity.length === 0" class="text-center py-4">
                <p class="text-sm text-gray-500">No recent activity</p>
              </div>
              <div v-else class="space-y-4">
                <ActivityItem
                  v-for="activity in recentActivity"
                  :key="activity.id"
                  :activity="activity"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { requestService } from '@/services'
import BaseButton from '@/components/ui/BaseButton.vue'
import StatsCard from '@/components/dashboard/StatsCard.vue'
import RequestCard from '@/components/dashboard/RequestCard.vue'
import ActivityItem from '@/components/dashboard/ActivityItem.vue'
import { formatCurrency } from '@/utils/formatters'
import type { ProcurementRequest } from '@/types'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const router = useRouter()

// State
const loading = ref(false)
const recentRequests = ref<ProcurementRequest[]>([])
const filteredRequests = ref<ProcurementRequest[]>([])
const stats = ref({
  totalRequests: 0,
  requestsChange: 0,
  activeOffers: 0,
  offersChange: 0,
  completedTransactions: 0,
  transactionsChange: 0,
  totalBudget: 0,
  budgetChange: 0,
})

const filters = ref({
  username: '',
  minBudget: 0,
  maxBudget: 0,
})

const recentActivity = ref([
  {
    id: '1',
    type: 'request_created',
    message: 'New procurement request created',
    timestamp: new Date().toISOString(),
    user: 'You',
  },
  {
    id: '2',
    type: 'offer_received',
    message: 'Received 3 new offers for Request #123',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: 'System',
  },
])

// Methods
const fetchDashboardData = async () => {
  loading.value = true
  try {
    const [requestsResponse] = await Promise.all([
      requestService.getAllRequests({ page: 1, limit: 10 }),
    ])

    recentRequests.value = Array.isArray(requestsResponse.data) ? requestsResponse.data : []
    filteredRequests.value = [...recentRequests.value]
    
    stats.value = {
      totalRequests: requestsResponse.total || 0,
      requestsChange: 12,
      activeOffers: 8,
      offersChange: 5,
      completedTransactions: 15,
      transactionsChange: -2,
      totalBudget: Array.isArray(recentRequests.value)
        ? recentRequests.value.reduce((sum, req) => sum + req.totalBudget, 0)
        : 0,
      budgetChange: 8,
    }

    // Apply any existing filters
    applyFilters()
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    notificationStore.error('Failed to load dashboard data')
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  filteredRequests.value = recentRequests.value.filter(request => {
    // Username filter
    const usernameMatch = !filters.value.username || 
      request.user?.name?.toLowerCase().includes(filters.value.username.toLowerCase())
    
    // Budget filters - only apply if values are greater than 0
    const minBudgetMatch = !filters.value.minBudget || filters.value.minBudget <= 0 || request.totalBudget >= filters.value.minBudget
    const maxBudgetMatch = !filters.value.maxBudget || filters.value.maxBudget <= 0 || request.totalBudget <= filters.value.maxBudget
    
    return usernameMatch && minBudgetMatch && maxBudgetMatch
  })
}

const clearFilters = () => {
  filters.value = {
    username: '',
    minBudget: 0,
    maxBudget: 0,
  }
  filteredRequests.value = [...recentRequests.value]
}

function handleRequestClick(request: any) {
  if (request.status === 'pending' && request.user._id !== authStore.user?._id) {
    router.push(`/request/${request._id}`)
  }
}

// Lifecycle
onMounted(() => {
  fetchDashboardData()
})
</script>
