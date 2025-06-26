<template>
  <TransitionGroup
    tag="div"
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="transform translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    class="fixed top-6 left-1/2 -translate-x-1/2 z-50 space-y-2 w-full flex flex-col items-center pointer-events-none"
  >
    <div
      v-for="notification in notifications"
      :key="notification.id"
      :class="notificationClasses(notification.type)"
      class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <component :is="iconComponent(notification.type)" class="h-6 w-6" />
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
            <p class="mt-1 text-sm text-gray-500">{{ notification.message }}</p>
            <div v-if="notification.action" class="mt-3 flex space-x-2">
              <BaseButton
                size="sm"
                variant="ghost"
                @click="notification.action.handler"
              >
                {{ notification.action.label }}
              </BaseButton>
            </div>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="removeNotification(notification.id)"
              class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import BaseButton from './BaseButton.vue'
import type { Notification } from '@/types'

const notificationStore = useNotificationStore()

const notifications = computed(() => notificationStore.notifications)

const removeNotification = (id: string) => {
  notificationStore.removeNotification(id)
}

const notificationClasses = (type: Notification['type']) => {
  const baseClasses = 'border-l-4'
  
  const typeClasses = {
    success: 'border-green-400',
    error: 'border-red-400',
    warning: 'border-yellow-400',
    info: 'border-blue-400',
  }
  
  return `${baseClasses} ${typeClasses[type]}`
}

const iconComponent = (type: Notification['type']) => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
  }
  
  return icons[type]
}

// Icon components
const CheckCircleIcon = {
  name: 'CheckCircleIcon',
  render() {
    return h('svg', {
      class: 'h-6 w-6 text-green-400',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ])
  }
}

const XCircleIcon = {
  name: 'XCircleIcon',
  render() {
    return h('svg', {
      class: 'h-6 w-6 text-red-400',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ])
  }
}

const ExclamationTriangleIcon = {
  name: 'ExclamationTriangleIcon',
  render() {
    return h('svg', {
      class: 'h-6 w-6 text-yellow-400',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
      })
    ])
  }
}

const InformationCircleIcon = {
  name: 'InformationCircleIcon',
  render() {
    return h('svg', {
      class: 'h-6 w-6 text-blue-400',
      fill: 'none',
      viewBox: '0 0 24 24',
      stroke: 'currentColor'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      })
    ])
  }
}
</script> 