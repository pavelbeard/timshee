/**
 * Shopping cart store using Zustand
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Cart } from '../types'

interface CartState {
  // State
  cart: Cart | null
  isLoading: boolean
  error: string | null

  // Actions
  setCart: (cart: Cart | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  clearCart: () => void

  // Computed properties
  totalItems: number
  totalPrice: number
  itemCount: (variantId: number) => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      cart: null,
      isLoading: false,
      error: null,

      // Actions
      setCart: (cart) => set({ cart, error: null }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      clearCart: () => set({ cart: null }),

      // Computed properties
      get totalItems() {
        const { cart } = get()
        return cart?.total_items || 0
      },

      get totalPrice() {
        const { cart } = get()
        return cart ? parseFloat(cart.total_price) : 0
      },

      itemCount: (variantId: number) => {
        const { cart } = get()
        if (!cart) return 0

        const item = cart.items.find((item) => item.variant.id === variantId)
        return item?.quantity || 0
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        cart: state.cart,
      }),
    }
  )
)
