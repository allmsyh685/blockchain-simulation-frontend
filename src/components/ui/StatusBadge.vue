<template>
  <span :class="badgeClasses" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
    {{ displayText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getStatusColor } from '@/utils/formatters'

interface Props {
  status: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const badgeClasses = computed(() => {
  const baseClasses = 'inline-flex items-center font-medium'
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  }
  
  return `${baseClasses} ${sizeClasses[props.size]} ${getStatusColor(props.status)}`
})

const displayText = computed(() => {
  return props.status.charAt(0).toUpperCase() + props.status.slice(1)
})
</script> 