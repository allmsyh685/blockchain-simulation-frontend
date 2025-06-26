<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Or
          <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </router-link>
        </p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="space-y-4">
          <BaseInput
            v-model="form.email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            :error="errors.email"
            required
            @blur="validateField('email')"
          />

          <BaseInput
            v-model="form.password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            :error="errors.password"
            required
            @blur="validateField('password')"
          />
        </div>

        <!-- Error Message -->
        <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Login failed
              </h3>
              <div class="mt-2 text-sm text-red-700">
                {{ authStore.error.message }}
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="authStore.isLoading"
          loading-text="Signing in..."
          full-width
        >
          Sign in
        </BaseButton>

        <!-- Forgot Password Link -->
        <div class="text-center">
          <a href="#" class="text-sm text-blue-600 hover:text-blue-500">
            Forgot your password?
          </a>
        </div>
      </form>

      <!-- Demo Credentials -->
      <div class="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 class="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h3>
        <div class="text-sm text-blue-700 space-y-1">
          <p><strong>Email:</strong> demo@example.com</p>
          <p><strong>Password:</strong> demo123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { validationRules } from '@/utils/validation'
import type { LoginCredentials } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// Form state
const form = reactive<LoginCredentials>({
  email: '',
  password: '',
})

// Validation errors
const errors = reactive({
  email: '',
  password: '',
})

// Validation rules
const rules = {
  email: [
    validationRules.required('Email is required'),
    validationRules.email('Please enter a valid email address'),
  ],
  password: [
    validationRules.required('Password is required'),
    validationRules.minLength(6, 'Password must be at least 6 characters'),
  ],
}

// Methods
const validateField = (field: keyof LoginCredentials) => {
  const fieldRules = rules[field]
  const value = form[field]
  
  for (const rule of fieldRules) {
    const result = rule(value)
    if (!result.isValid) {
      errors[field] = result.message || ''
      return false
    }
  }
  
  errors[field] = ''
  return true
}

const validateForm = () => {
  let isValid = true
  
  for (const field of Object.keys(form) as Array<keyof LoginCredentials>) {
    if (!validateField(field)) {
      isValid = false
    }
  }
  
  return isValid
}

const handleLogin = async () => {
  // Clear previous errors
  authStore.clearError()
  
  // Validate form
  if (!validateForm()) {
    return
  }

  try {
    await authStore.login(form)
    notificationStore.success('Welcome back!', 'Login successful')
    router.push('/dashboard')
  } catch (error: any) {
    console.error('Login error:', error)
    // Error is already handled by the auth store
  }
}
</script>
  