import httpService from './http'
import type { Transaction, PaginationParams, PaginatedResponse } from '@/types'

// Helper function to transform API transaction to frontend format
const transformTransaction = (apiTransaction: any): Transaction => {
  return {
    _id: apiTransaction._id,
    requestId: apiTransaction.request?._id || apiTransaction.request,
    offerId: apiTransaction.offer?._id || apiTransaction.offer,
    buyer: apiTransaction.buyer,
    supplier: apiTransaction.vendor || apiTransaction.supplier,
    items: apiTransaction.items || [],
    totalAmount: apiTransaction.totalAmount,
    status: apiTransaction.status,
    createdAt: apiTransaction.createdAt,
    updatedAt: apiTransaction.updatedAt,
    blockchainHash: apiTransaction.blockchainHash,
    paymentStatus: apiTransaction.paymentStatus
  }
}

class TransactionService {
  async getAllTransactions(params?: PaginationParams): Promise<PaginatedResponse<Transaction>> {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    // API returns plain array, not paginated response
    const apiTransactions = await httpService.get<any[]>(`/transactions?${queryParams.toString()}`)
    
    // Transform API transactions to frontend format
    const transformedTransactions = Array.isArray(apiTransactions) 
      ? apiTransactions.map(transformTransaction)
      : []
    
    // Create paginated response structure
    const limit = params?.limit || 10
    const page = params?.page || 1
    
    return {
      data: transformedTransactions,
      total: transformedTransactions.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(transformedTransactions.length / limit)
    }
  }

  async getTransactionById(id: string): Promise<Transaction> {
    const response = await httpService.get<any>(`/transactions/${id}`)
    return transformTransaction(response.transaction || response)
  }

  async createTransaction(offerId: string): Promise<Transaction> {
    const response = await httpService.post<any>(`/transactions/accept/${offerId}`)
    return transformTransaction(response.transaction || response)
  }

  async updateTransactionStatus(id: string, status: Transaction['status']): Promise<Transaction> {
    const response = await httpService.patch<any>(`/transactions/${id}/status`, { status })
    return transformTransaction(response.transaction || response)
  }

  async getMyTransactions(params?: PaginationParams): Promise<PaginatedResponse<Transaction>> {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString())
        }
      })
    }
    
    console.log(`[DEBUG] Frontend: Fetching user transactions`);
    
    // API returns object with transactions array, not paginated response
    const response = await httpService.get<any>(`/transactions/user-transactions?${queryParams.toString()}`)
    console.log(`[DEBUG] Frontend: User transactions response:`, response);
    
    const apiTransactions = response.transactions || []
    console.log(`[DEBUG] Frontend: Found ${apiTransactions.length} transactions`);
    
    // Transform API transactions to frontend format
    const transformedTransactions = Array.isArray(apiTransactions) 
      ? apiTransactions.map(transformTransaction)
      : []
    
    console.log(`[DEBUG] Frontend: Transformed ${transformedTransactions.length} transactions`);
    
    // Create paginated response structure
    const limit = params?.limit || 10
    const page = params?.page || 1
    
    return {
      data: transformedTransactions,
      total: transformedTransactions.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(transformedTransactions.length / limit)
    }
  }

  async getTransactionsByRequest(requestId: string): Promise<Transaction[]> {
    // This endpoint might not exist in the backend, so we'll filter from all transactions
    const allTransactions = await this.getMyTransactions()
    return allTransactions.data.filter(t => t.requestId === requestId)
  }
}

export const transactionService = new TransactionService()
export default transactionService 