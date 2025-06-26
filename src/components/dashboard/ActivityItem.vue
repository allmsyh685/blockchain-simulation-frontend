<template>
  <div class="flex items-start space-x-3">
    <div class="flex-shrink-0">
      <div :class="iconContainerClasses" class="w-8 h-8 rounded-full flex items-center justify-center">
        <component :is="activityIcon" class="w-4 h-4 text-white" />
      </div>
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm text-gray-900">{{ activity.message }}</p>
      <div class="flex items-center mt-1 text-xs text-gray-500">
        <span>{{ activity.user }}</span>
        <span class="mx-1">•</span>
        <span>{{ formatRelativeTime(activity.timestamp) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { formatRelativeTime } from '@/utils/formatters'

interface Activity {
  id: string
  type: string
  message: string
  timestamp: string
  user: string
}

interface Props {
  activity: Activity
}

const props = defineProps<Props>()

const iconContainerClasses = computed(() => {
  const colorClasses: Record<string, string> = {
    request_created: 'bg-blue-500',
    offer_received: 'bg-green-500',
    transaction_completed: 'bg-purple-500',
    offer_accepted: 'bg-yellow-500',
    offer_rejected: 'bg-red-500',
  }
  return colorClasses[props.activity.type] || 'bg-gray-500'
})

const activityIcon = computed(() => {
  const icons: Record<string, any> = {
    request_created: DocumentIcon,
    offer_received: CurrencyDollarIcon,
    transaction_completed: CheckCircleIcon,
    offer_accepted: ThumbUpIcon,
    offer_rejected: XCircleIcon,
  }
  return icons[props.activity.type] || DocumentIcon
})

// Icon components
const DocumentIcon = {
  name: 'DocumentIcon',
  render() {
    return h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
      })
    ])
  }
}

const CurrencyDollarIcon = {
  name: 'CurrencyDollarIcon',
  render() {
    return h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
      })
    ])
  }
}

const CheckCircleIcon = {
  name: 'CheckCircleIcon',
  render() {
    return h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
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

const ThumbUpIcon = {
  name: 'ThumbUpIcon',
  render() {
    return h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5'
      })
    ])
  }
}

const XCircleIcon = {
  name: 'XCircleIcon',
  render() {
    return h('svg', {
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
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
</script> 