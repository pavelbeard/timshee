/**
 * Shopping cart API service
 */

import type { AddToCartData, Cart, UpdateCartItemData } from '../types'
import { apiClient } from './client'

export const cartApi = {
  /**
   * Get current cart
   */
  getCurrent: (): Promise<Cart> => apiClient.get('/shopping/cart/current/'),

  /**
   * Add item to cart
   */
  addItem: (data: AddToCartData): Promise<Cart> =>
    apiClient.post('/shopping/cart/add_item/', data),

  /**
   * Update cart item quantity
   */
  updateItem: (data: UpdateCartItemData): Promise<Cart> =>
    apiClient.put('/shopping/cart/update_item/', data),

  /**
   * Remove item from cart
   */
  removeItem: (variant_id: number): Promise<Cart> =>
    apiClient.delete(`/shopping/cart/remove_item/?variant_id=${variant_id}`),

  /**
   * Clear cart
   */
  clear: (): Promise<Cart> => apiClient.delete('/shopping/cart/clear/'),
}
