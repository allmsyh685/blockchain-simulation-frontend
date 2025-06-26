<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <router-link to="/dashboard" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 class="text-xl font-bold text-gray-900">{{ appName }}</h1>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <nav class="hidden md:flex space-x-8">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            :class="[
              'text-sm font-medium px-3 py-2 rounded-md transition-colors duration-200',
              $route.path === item.path
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            ]"
          >
            {{ item.name }}
          </router-link>
        </nav>

        <!-- User Menu -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button
            @click="toggleNotifications"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 00-6 6v3.75a6 6 0 006 6h3a6 6 0 006-6V9.75a6 6 0 00-6-6h-3z" />
            </svg>
          </button>

          <!-- User Profile Dropdown -->
          <div class="relative user-menu">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {{ userInitials }}
              </div>
              <span class="hidden md:block text-sm font-medium text-gray-700">{{ username }}</span>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
            >
              <div class="px-4 py-2 border-b border-gray-100">
                <p class="text-sm font-medium text-gray-900">{{ username }}</p>
                <p class="text-sm text-gray-500">{{ userEmail }}</p>
              </div>
              
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                @click="closeUserMenu"
              >
                Profile Settings
              </router-link>
              
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            ref="hamburgerRef"
            @click="toggleMobileMenu"
            class="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-gray-200 py-4 mobile-menu">
        <nav class="space-y-2">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            :class="[
              'block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200',
              $route.path === item.path
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            ]"
            @click="closeMobileMenu"
          >
            {{ item.name }}
          </router-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getInitials } from '@/utils/formatters'
import { config } from '@/config/environment'

const router = useRouter()
const authStore = useAuthStore()

// Reactive state
const isUserMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)

// Add ref for hamburger button
const hamburgerRef = ref<HTMLElement | null>(null)

// Computed properties
const username = computed(() => authStore.user?.name || 'Guest')
const userEmail = computed(() => authStore.user?.email || '')
const userInitials = computed(() => getInitials(username.value))
const appName = computed(() => config.app.name)

// Navigation items based on user role
const navigationItems = computed(() => {
  const baseItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Requests', path: '/my-request' },
    { name: 'Transactions', path: '/transactions' },
  ]

  if (authStore.isSupplier) {
    baseItems.push({ name: 'My Offers', path: '/offers' })
  }

  baseItems.push({ name: 'Blockchain', path: '/blockchain' })

  return baseItems
})

// Methods
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const toggleNotifications = () => {
  // TODO: Implement notifications panel
  console.log('Toggle notifications')
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    router.push('/login')
  }
}

// Close menus when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  // Check if click is outside user menu, mobile menu, and hamburger button
  const userMenuElement = target.closest('.user-menu')
  const mobileMenuElement = target.closest('.mobile-menu')
  // Check if click is on the hamburger button
  if (hamburgerRef.value && hamburgerRef.value.contains(target)) {
    return
  }
  if (!userMenuElement && !mobileMenuElement) {
    isUserMenuOpen.value = false
    isMobileMenuOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

  