import axios from 'axios'

// Base Axios instance
const instance = axios.create({
  baseURL: 'https://blockchain-simulation-api-production.up.railway.app/api', // Railway deployment URL
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor untuk menambahkan Authorization token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance
