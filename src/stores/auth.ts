// /src/store/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterData } from '@/types'
import { authService } from '@/services'
import type { AppError } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string>('')
  const isLoading = ref(false)
  const error = ref<AppError | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || 'user')
  const isAdmin = computed(() => userRole.value === 'admin')
  const isSupplier = computed(() => userRole.value === 'supplier')

  // Actions
  const initializeAuth = () => {
    console.log('Initializing auth...')
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    console.log('Stored token:', storedToken ? 'present' : 'missing')
    console.log('Stored user:', storedUser ? 'present' : 'missing')

    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        console.log('Auth initialized from localStorage')
      } catch (e) {
        console.error('Failed to parse stored user data:', e)
        clearAuth()
      }
    } else {
      console.log('No stored auth data found')
    }
  }

  const setAuth = (newToken: string, newUser: User) => {
    console.log('Setting auth - token:', newToken ? 'present' : 'missing', 'user:', newUser)
    token.value = newToken
    user.value = newUser
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    error.value = null
    console.log('Auth set successfully')
  }

  const clearAuth = () => {
    console.log('Clearing auth data')
    token.value = ''
    user.value = null
    error.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    console.log('Auth cleared successfully')
  }

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('Attempting login with:', credentials.email)
      const response = await authService.login(credentials)
      console.log('Login response:', response)
      setAuth(response.token, response.user)
      console.log('Auth set successfully, user:', response.user)
      return response
    } catch (err: any) {
      console.error('Login error:', err)
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: RegisterData) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authService.register(data)
      setAuth(response.token, response.user)
      return response
    } catch (err: any) {
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      // Try to call backend logout, but don't fail if it doesn't exist
      await authService.logout()
    } catch (err) {
      console.warn('Backend logout failed, continuing with local cleanup:', err)
    } finally {
      // Always clear local auth data
      clearAuth()
    }
  }

  const refreshUser = async () => {
    if (!token.value) return

    try {
      const currentUser = await authService.getCurrentUser()
      user.value = currentUser
      localStorage.setItem('user', JSON.stringify(currentUser))
    } catch (err) {
      console.error('Failed to refresh user:', err)
      clearAuth()
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    isSupplier,
    
    // Actions
    initializeAuth,
    setAuth,
    clearAuth,
    login,
    register,
    logout,
    refreshUser,
    clearError,
  }
})