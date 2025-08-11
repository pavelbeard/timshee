/**
 * Catalog API service
 */

import type {
  Category,
  Collection,
  Color,
  PaginatedResponse,
  Product,
  ProductType,
  Size,
  WishlistItem,
} from '../types'
import { apiClient } from './client'

export const catalogApi = {
  /**
   * Products
   */
  products: {
    getAll: (params?: {
      page?: number
      page_size?: number
      category?: string
      collection?: string
      gender?: string
      search?: string
      is_featured?: boolean
      is_on_sale?: boolean
    }): Promise<PaginatedResponse<Product>> =>
      apiClient.get('/catalog/products/', params as Record<string, string>),

    getById: (id: number): Promise<Product> =>
      apiClient.get(`/catalog/products/${id}/`),

    getBySlug: (slug: string): Promise<Product> =>
      apiClient.get(`/catalog/products/slug/${slug}/`),

    getFeatured: (): Promise<Product[]> =>
      apiClient.get('/catalog/products/featured/'),

    getOnSale: (): Promise<Product[]> =>
      apiClient.get('/catalog/products/on-sale/'),
  },

  /**
   * Collections
   */
  collections: {
    getAll: (params?: { is_active?: boolean }): Promise<Collection[]> =>
      apiClient.get('/catalog/collections/', params as Record<string, string>),

    getById: (id: number): Promise<Collection> =>
      apiClient.get(`/catalog/collections/${id}/`),

    getWelcomeCollections: (): Promise<Collection[]> =>
      apiClient.get('/catalog/collections/welcome/'),
  },

  /**
   * Categories
   */
  categories: {
    getAll: (params?: { is_active?: boolean }): Promise<Category[]> =>
      apiClient.get('/catalog/categories/', params as Record<string, string>),

    getById: (id: number): Promise<Category> =>
      apiClient.get(`/catalog/categories/${id}/`),
  },

  /**
   * Product Types
   */
  productTypes: {
    getAll: (params?: {
      category?: number
      is_active?: boolean
    }): Promise<ProductType[]> =>
      apiClient.get('/catalog/types/', params as Record<string, string>),

    getById: (id: number): Promise<ProductType> =>
      apiClient.get(`/catalog/types/${id}/`),
  },

  /**
   * Sizes
   */
  sizes: {
    getAll: (): Promise<Size[]> => apiClient.get('/catalog/sizes/'),
  },

  /**
   * Colors
   */
  colors: {
    getAll: (params?: { is_active?: boolean }): Promise<Color[]> =>
      apiClient.get('/catalog/colors/', params as Record<string, string>),
  },

  /**
   * Wishlist
   */
  wishlist: {
    getItems: (): Promise<WishlistItem[]> =>
      apiClient.get('/catalog/wishlist/'),

    addItem: (variant_id: number): Promise<WishlistItem> =>
      apiClient.post('/catalog/wishlist/add_item/', { variant_id }),

    removeItem: (id: number): Promise<void> =>
      apiClient.delete(`/catalog/wishlist/${id}/`),

    clear: (): Promise<void> => apiClient.delete('/catalog/wishlist/clear/'),
  },
}
