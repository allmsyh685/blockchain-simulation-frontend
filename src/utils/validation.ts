/**
 * Email validation
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Password validation
 */
export const validatePassword = (password: string): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Phone number validation for Indonesian format
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  
  // Indonesian phone number patterns
  const patterns = [
    /^62\d{9,12}$/, // +62 format
    /^0\d{9,12}$/,  // 0 format
  ]
  
  return patterns.some(pattern => pattern.test(cleaned))
}

/**
 * Required field validation
 */
export const isRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  if (Array.isArray(value)) {
    return value.length > 0
  }
  return value !== null && value !== undefined
}

/**
 * Minimum length validation
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength
}

/**
 * Maximum length validation
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength
}

/**
 * Number range validation
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

/**
 * URL validation
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Date validation
 */
export const isValidDate = (date: string): boolean => {
  const dateObj = new Date(date)
  return dateObj instanceof Date && !isNaN(dateObj.getTime())
}

/**
 * Future date validation
 */
export const isFutureDate = (date: string): boolean => {
  const dateObj = new Date(date)
  const now = new Date()
  return dateObj > now
}

/**
 * Past date validation
 */
export const isPastDate = (date: string): boolean => {
  const dateObj = new Date(date)
  const now = new Date()
  return dateObj < now
}

/**
 * File size validation
 */
export const isValidFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return file.size <= maxSizeInBytes
}

/**
 * File type validation
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type)
}

/**
 * Form validation helper
 */
export const validateForm = <T extends Record<string, any>>(
  data: T,
  rules: Record<keyof T, ((value: any) => { isValid: boolean; message?: string })[]>
): { isValid: boolean; errors: Record<keyof T, string[]> } => {
  const errors: Record<keyof T, string[]> = {} as Record<keyof T, string[]>
  let isValid = true

  for (const [field, fieldRules] of Object.entries(rules)) {
    const fieldErrors: string[] = []
    const value = data[field as keyof T]

    for (const rule of fieldRules) {
      const result = rule(value)
      if (!result.isValid && result.message) {
        fieldErrors.push(result.message)
        isValid = false
      }
    }

    if (fieldErrors.length > 0) {
      errors[field as keyof T] = fieldErrors
    }
  }

  return { isValid, errors }
}

/**
 * Common validation rules
 */
export const validationRules = {
  required: (message = 'This field is required') => (value: any) => ({
    isValid: isRequired(value),
    message: !isRequired(value) ? message : undefined,
  }),
  
  email: (message = 'Please enter a valid email address') => (value: string) => ({
    isValid: isValidEmail(value),
    message: !isValidEmail(value) ? message : undefined,
  }),
  
  minLength: (min: number, message?: string) => (value: string) => ({
    isValid: hasMinLength(value, min),
    message: !hasMinLength(value, min) ? message || `Minimum length is ${min} characters` : undefined,
  }),
  
  maxLength: (max: number, message?: string) => (value: string) => ({
    isValid: hasMaxLength(value, max),
    message: !hasMaxLength(value, max) ? message || `Maximum length is ${max} characters` : undefined,
  }),
  
  phone: (message = 'Please enter a valid phone number') => (value: string) => ({
    isValid: isValidPhoneNumber(value),
    message: !isValidPhoneNumber(value) ? message : undefined,
  }),
  
  futureDate: (message = 'Date must be in the future') => (value: string) => ({
    isValid: isFutureDate(value),
    message: !isFutureDate(value) ? message : undefined,
  }),
  
  positiveNumber: (message = 'Must be a positive number') => (value: number) => ({
    isValid: value > 0,
    message: value <= 0 ? message : undefined,
  }),
} 