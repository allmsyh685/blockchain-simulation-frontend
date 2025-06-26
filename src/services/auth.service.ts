import httpService from './http'
import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types'
import { useAuthStore } from '@/stores/auth'

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await httpService.post<any>('/auth/login', credentials)
    
    // Transform backend response to frontend expected format
    return {
      token: response.token,
      user: {
        _id: response._id,
        name: response.name,
        email: response.email,
        role: 'user' // Default role since backend doesn't have roles
      }
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await httpService.post<any>('/auth/register', data)
    
    // Transform backend response to frontend expected format
    return {
      token: response.token,
      user: {
        _id: response._id,
        name: response.name,
        email: response.email,
        role: 'user' // Default role since backend doesn't have roles
      }
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await httpService.get<any>('/auth/me')
    
    // Transform backend response to frontend expected format
    return {
      _id: response.user._id,
      name: response.user.name,
      email: response.user.email,
      role: 'user' // Default role since backend doesn't have roles
    }
  }

  async refreshToken(): Promise<{ token: string }> {
    // Backend doesn't have refresh token endpoint, so we'll just return the current token
    const authStore = useAuthStore()
    return { token: authStore.token }
  }

  async logout(): Promise<void> {
    // Backend doesn't have logout endpoint, so we'll just resolve
    // The actual logout logic is handled in the auth store
    return Promise.resolve()
  }
}

export const authService = new AuthService()
export default authService 