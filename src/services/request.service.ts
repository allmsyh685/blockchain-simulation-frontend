import httpService from './http'
import type { 
  ProcurementRequest, 
  CreateRequestForm, 
  RequestFilters, 
  PaginationParams, 
  PaginatedResponse 
} from '@/types'

// Helper function to calculate total budget from items
const calculateTotalBudget = (items: any[]): number => {
  if (!Array.isArray(items)) return 0
  return items.reduce((sum, item) => sum + (item.budget * item.quantity), 0)
}

// Helper function to transform API request to frontend format
const transformRequest = (apiRequest: any): ProcurementRequest => {
  return {
    _id: apiRequest._id,
    user: apiRequest.user,
    items: apiRequest.items || [],
    deadline: apiRequest.deadline,
    status: apiRequest.status === 'open' ? 'pending' : apiRequest.status, // Map 'open' to 'pending'
    totalBudget: calculateTotalBudget(apiRequest.items),
    createdAt: apiRequest.createdAt,
    updatedAt: apiRequest.updatedAt,
    description: apiRequest.description,
    priority: apiRequest.priority
  }
}

class RequestService {
  async getAllRequests(params?: PaginationParams & RequestFilters): Promise<PaginatedResponse<ProcurementRequest>> {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    // API returns plain array, not paginated response
    const apiRequests = await httpService.get<any[]>(`/requests?${queryParams.toString()}`)
    
    // Transform API requests to frontend format
    const transformedRequests = Array.isArray(apiRequests) 
      ? apiRequests.map(transformRequest)
      : []
    
    // Create paginated response structure
    const limit = params?.limit || 10
    const page = params?.page || 1
    
    return {
      data: transformedRequests,
      total: transformedRequests.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(transformedRequests.length / limit)
    }
  }

  async getRequestById(id: string): Promise<ProcurementRequest> {
    const response = await httpService.get<any>(`/requests/${id}`)
    return transformRequest(response)
  }

  async createRequest(data: CreateRequestForm): Promise<ProcurementRequest> {
    const response = await httpService.post<any>('/requests', data)
    return transformRequest(response)
  }

  async updateRequest(id: string, data: Partial<CreateRequestForm>): Promise<ProcurementRequest> {
    const response = await httpService.put<any>(`/requests/${id}`, data)
    return transformRequest(response)
  }

  async deleteRequest(id: string): Promise<void> {
    return httpService.delete<void>(`/requests/${id}`)
  }

  async getMyRequests(params?: PaginationParams): Promise<PaginatedResponse<ProcurementRequest>> {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    // API returns plain array, not paginated response
    const apiRequests = await httpService.get<any[]>(`/requests/my?${queryParams.toString()}`)
    
    // Transform API requests to frontend format
    const transformedRequests = Array.isArray(apiRequests) 
      ? apiRequests.map(transformRequest)
      : []
    
    // Create paginated response structure
    const limit = params?.limit || 10
    const page = params?.page || 1
    
    return {
      data: transformedRequests,
      total: transformedRequests.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(transformedRequests.length / limit)
    }
  }
}

export const requestService = new RequestService()
export default requestService 