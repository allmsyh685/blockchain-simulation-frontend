import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Notification } from '@/types'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      id,
      ...notification,
    }

    notifications.value.push(newNotification)

    // Auto remove notification after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 5000)
    }

    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAllNotifications = () => {
    notifications.value = []
  }

  const success = (message: string, title = 'Success') => {
    return addNotification({
      type: 'success',
      title,
      message,
    })
  }

  const error = (message: string, title = 'Error') => {
    return addNotification({
      type: 'error',
      title,
      message,
    })
  }

  const warning = (message: string, title = 'Warning') => {
    return addNotification({
      type: 'warning',
      title,
      message,
    })
  }

  const info = (message: string, title = 'Info') => {
    return addNotification({
      type: 'info',
      title,
      message,
    })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
  }
}) 