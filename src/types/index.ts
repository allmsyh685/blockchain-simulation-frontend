// User related types
export interface User {
  _id: string
  name: string
  email: string
  role?: 'admin' | 'user' | 'supplier'
  createdAt?: string
  updatedAt?: string
}

// Authentication types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Item and Request types
export interface ProcurementItem {
  _id?: string
  name: string
  brand: string
  spec: string
  budget: number
  quantity: number
  unit?: string
  description?: string
}

export interface ProcurementRequest {
  _id: string
  user: User
  items: ProcurementItem[]
  deadline: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  totalBudget: number
  createdAt: string
  updatedAt: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
}

// Offer types
export interface Offer {
  _id: string
  requestId: string
  supplier: User
  items: ProcurementItem[]
  totalPrice: number
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  updatedAt: string
  notes?: string
  deliveryTime?: number // in days
}

// Transaction types
export interface Transaction {
  _id: string
  requestId: string
  offerId: string
  buyer: User
  supplier: User
  items: ProcurementItem[]
  totalAmount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
  blockchainHash?: string
  paymentStatus?: 'pending' | 'paid' | 'failed'
}

// Filter and search types
export interface RequestFilters {
  name?: string
  brand?: string
  spec?: string
  minBudget?: number
  maxBudget?: number
  status?: string
  priority?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Form types
export interface CreateRequestForm {
  items: ProcurementItem[]
  deadline: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
}

export interface CreateOfferForm {
  items: ProcurementItem[]
  notes?: string
  deliveryTime?: number
}

// UI Component types
export interface TableColumn<T = any> {
  key: keyof T
  label: string
  sortable?: boolean
  width?: string
  render?: (value: any, row: T) => string | number | boolean
}

export interface ModalProps {
  isOpen: boolean
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
}

// Blockchain types
export interface BlockchainBlock {
  index: number
  timestamp: string
  data: any
  previousHash: string
  nonce: number
  hash: string
}

export interface MiningStep {
  nonce: number
  hash: string
  description: string
  messagePadding: string
  messageScheduling: string
  messageCompression: string
  finalHash: string
}

// Notification types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    handler: () => void
  }
} 