<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <div class="mx-auto h-24 w-24 text-gray-400">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
        </svg>
      </div>
      <h1 class="mt-6 text-3xl font-extrabold text-gray-900">Page not found</h1>
      <p class="mt-2 text-sm text-gray-600">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div class="mt-6">
        <BaseButton
          @click="$router.push('/dashboard')"
          variant="primary"
          size="lg"
        >
          Go back to Dashboard
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
</script> 