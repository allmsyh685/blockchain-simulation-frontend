export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://blockchain-simulation-api-production.up.railway.app/api',
    timeout: 10000,
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'eProBlock',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
} as const

export type Config = typeof config 