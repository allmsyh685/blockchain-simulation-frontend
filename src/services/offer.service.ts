import httpService from './http'
import type { Offer, CreateOfferForm, PaginationParams, PaginatedResponse } from '@/types'

// Helper function to calculate total price from items
const calculateTotalPrice = (items: any[]): number => {
  if (!Array.isArray(items)) return 0
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
}

// Helper function to transform API offer to frontend format
const transformOffer = (apiOffer: any): Offer => {
  return {
    _id: apiOffer._id,
    requestId: apiOffer.request?._id || apiOffer.request,
    supplier: apiOffer.user,
    items: apiOffer.items || [],
    totalPrice: calculateTotalPrice(apiOffer.items),
    status: apiOffer.status,
    createdAt: apiOffer.createdAt,
    updatedAt: apiOffer.updatedAt,
    notes: apiOffer.notes,
    deliveryTime: apiOffer.deliveryTime
  }
}

class OfferService {
  async getOffersForRequest(requestId: string, params?: PaginationParams): Promise<PaginatedResponse<Offer>> {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    // API returns plain array, not paginated response
    const apiOffers = await httpService.get<any[]>(`/offers/by-request/${requestId}?${queryParams.toString()}`)
    
    // Transform API offers to frontend format
    const transformedOffers = Array.isArray(apiOffers) 
      ? apiOffers.map(transformOffer)
      : []
    
    // Create paginated response structure
    const limit = params?.limit || 10
    const page = params?.page || 1
    
    return {
      data: transformedOffers,
      total: transformedOffers.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(transformedOffers.length / limit)
    }
  }

  async getOfferById(offerId: string): Promise<Offer> {
    const response = await httpService.get<any>(`/offers/${offerId}`)
    return transformOffer(response)
  }

  async createOffer(requestId: string, data: CreateOfferForm): Promise<Offer> {
    const response = await httpService.post<any>(`/offers`, { requestId, ...data })
    return transformOffer(response)
  }

  async updateOffer(offerId: string, data: Partial<CreateOfferForm>): Promise<Offer> {
    const response = await httpService.put<any>(`/offers/${offerId}`, data)
    return transformOffer(response)
  }

  async deleteOffer(offerId: string): Promise<void> {
    return httpService.delete<void>(`/offers/${offerId}`)
  }

  async acceptOffer(offerId: string): Promise<Offer> {
    console.log(`[DEBUG] Frontend: Accepting offer ${offerId}`);
    const response = await httpService.post<any>(`/offers/accept/${offerId}`)
    console.log(`[DEBUG] Frontend: Accept offer response:`, response);
    
    // The backend now returns { offer, transaction }
    if (response.offer && response.transaction) {
      console.log(`[DEBUG] Frontend: Offer accepted and transaction created:`, response.transaction._id);
      return transformOffer(response.offer);
    } else if (response.offer) {
      console.log(`[DEBUG] Frontend: Offer accepted but no transaction data`);
      return transformOffer(response.offer);
    } else {
      console.log(`[DEBUG] Frontend: Using response directly as offer`);
      return transformOffer(response);
    }
  }

  async rejectOffer(offerId: string): Promise<Offer> {
    const response = await httpService.post<any>(`/offers/reject/${offerId}`)
    return transformOffer(response)
  }

  async getMyOffers(params?: PaginationParams): Promise<PaginatedResponse<Offer>> {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    // API returns plain array, not paginated response
    const apiOffers = await httpService.get<any[]>(`/offers/my?${queryParams.toString()}`)
    
    // Transform API offers to frontend format
    const transformedOffers = Array.isArray(apiOffers) 
      ? apiOffers.map(transformOffer)
      : []
    
    // Create paginated response structure
    const limit = params?.limit || 10
    const page = params?.page || 1
    
    return {
      data: transformedOffers,
      total: transformedOffers.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(transformedOffers.length / limit)
    }
  }
}

export const offerService = new OfferService()
export default offerService 