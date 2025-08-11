/**
 * Base API response types
 */
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  error?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  next: string | null
  previous: string | null
}

/**
 * User and Authentication types
 */
export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export interface UserProfile {
  user: User
  email_confirmed: boolean
  preferred_language: 'en' | 'es' | 'ru'
  phone_number?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  password_confirm: string
  first_name?: string
  last_name?: string
}

export interface AuthResponse {
  user: User
  access: string
  refresh?: string
}

/**
 * Product and Catalog types
 */
export interface Size {
  id: number
  value: string
  sort_order: number
}

export interface Color {
  id: number
  name: string
  hex: string
  is_active: boolean
}

export interface Collection {
  id: number
  name: string
  description: string
  link: string
  is_active: boolean
  show_in_welcome_page: boolean
  main_image?: string
  men_image?: string
  women_image?: string
  unisex_image?: string
  created_at: string
}

export interface Category {
  id: number
  name: string
  code: string
  description: string
  is_active: boolean
  apply_gender: boolean
  main_image?: string
  women_image?: string
  men_image?: string
  unisex_image?: string
  created_at: string
}

export interface ProductType {
  id: number
  name: string
  code: string
  category: Category
  is_active: boolean
}

export interface ProductVariant {
  id: number
  size: Size
  color: Color
  sku: string
  stock_quantity: number
  is_active: boolean
  is_in_stock: boolean
}

export interface ProductImage {
  id: number
  image: string
  alt_text: string
  sort_order: number
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  additional_info?: string
  gender: 'women' | 'men' | 'unisex' | 'misc'
  collection: Collection
  product_type: ProductType
  base_price: string
  discount_percentage: string
  discounted_price: string
  main_image: string
  is_active: boolean
  is_featured: boolean
  is_on_sale: boolean
  images?: ProductImage[]
  variants?: ProductVariant[]
  available_sizes?: Size[]
  available_colors?: Color[]
  created_at: string
}

/**
 * Shopping Cart types
 */
export interface CartItem {
  id: number
  variant: ProductVariant
  quantity: number
  created_at: string
}

export interface Cart {
  id: number
  items: CartItem[]
  is_active: boolean
  total_items: number
  total_price: string
  created_at: string
}

export interface AddToCartData {
  variant_id: number
  quantity: number
}

export interface UpdateCartItemData {
  variant_id: number
  quantity: number
}

/**
 * Wishlist types
 */
export interface WishlistItem {
  id: number
  variant: ProductVariant
  created_at: string
}

/**
 * Settings types
 */
export interface AppSettings {
  on_content_update: boolean
  on_maintenance: boolean
  experimental: boolean
  international: boolean
  items_for_genders: boolean
}

/**
 * Error types
 */
export interface ApiError {
  message: string
  code?: string
  field?: string
}

export interface ValidationError {
  [field: string]: string[]
}
