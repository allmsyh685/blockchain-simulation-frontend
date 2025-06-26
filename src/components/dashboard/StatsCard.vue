<template>
  <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
    <div class="p-5">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div :class="iconContainerClasses" class="rounded-md p-3">
            <component :is="iconComponent" class="h-6 w-6 text-white" />
          </div>
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ title }}
            </dt>
            <dd class="flex items-baseline">
              <div class="text-2xl font-semibold text-gray-900">
                {{ value }}
              </div>
              <div
                v-if="change !== undefined"
                :class="changeColorClasses"
                class="ml-2 flex items-baseline text-sm font-semibold"
              >
                <component
                  :is="changeIcon"
                  class="self-center flex-shrink-0 h-4 w-4"
                  :class="change > 0 ? 'text-green-500' : 'text-red-500'"
                />
                <span class="sr-only">
                  {{ change > 0 ? 'Increased' : 'Decreased' }} by
                </span>
                {{ Math.abs(change) }}%
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'

interface Props {
  title: string
  value: string | number
  change?: number
  icon: string
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'gray'
}

const props = withDefaults(defineProps<Props>(), {
  change: undefined,
})

const iconContainerClasses = computed(() => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    gray: 'bg-gray-500',
  }
  return colorClasses[props.color]
})

const changeColorClasses = computed(() => {
  if (props.change === undefined) return ''
  return props.change > 0 ? 'text-green-600' : 'text-red-600'
})

const iconComponent = computed(() => {
  const icons: Record<string, any> = {
    DocumentIcon: DocumentIcon,
    CurrencyDollarIcon: CurrencyDollarIcon,
    CheckCircleIcon: CheckCircleIcon,
    ChartBarIcon: ChartBarIcon,
    UserIcon: UserIcon,
    ShoppingCartIcon: ShoppingCartIcon,
  }
  return icons[props.icon] || DocumentIcon
})

const changeIcon = computed(() => {
  return props.change && props.change > 0 ? ArrowUpIcon : ArrowDownIcon
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

const ChartBarIcon = {
  name: 'ChartBarIcon',
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
        d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
      })
    ])
  }
}

const UserIcon = {
  name: 'UserIcon',
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
        d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      })
    ])
  }
}

const ShoppingCartIcon = {
  name: 'ShoppingCartIcon',
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
        d: 'M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01'
      })
    ])
  }
}

const ArrowUpIcon = {
  name: 'ArrowUpIcon',
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
        d: 'M5 10l7-7m0 0l7 7m-7-7v18'
      })
    ])
  }
}

const ArrowDownIcon = {
  name: 'ArrowDownIcon',
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
        d: 'M19 14l-7 7m0 0l-7-7m7 7V3'
      })
    ])
  }
}
</script> 