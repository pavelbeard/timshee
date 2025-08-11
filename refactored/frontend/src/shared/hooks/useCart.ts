/**
 * Cart hooks using TanStack Query and Zustand store
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cartApi } from '../api'
import { useCartStore } from '../stores/cart'
import type { AddToCartData, UpdateCartItemData } from '../types'

// Query keys for consistency
export const CART_QUERY_KEYS = {
  cart: ['cart'] as const,
}

/**
 * Get cart items from server
 */
export const useCartQuery = () => {
  const { setCart, setLoading, setError } = useCartStore()

  return useQuery({
    queryKey: CART_QUERY_KEYS.cart,
    queryFn: async () => {
      setLoading(true)
      try {
        const cart = await cartApi.getCurrent()
        setCart(cart)
        setError(null)
        return cart
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load cart')
        throw error
      } finally {
        setLoading(false)
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Add item to cart
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient()
  const { setCart, setError } = useCartStore()

  return useMutation({
    mutationFn: (data: AddToCartData) => cartApi.addItem(data),
    onSuccess: (cart) => {
      setCart(cart)
      queryClient.setQueryData(CART_QUERY_KEYS.cart, cart)
    },
    onError: (error) => {
      setError(
        error instanceof Error ? error.message : 'Failed to add item to cart'
      )
    },
  })
}

/**
 * Update cart item quantity
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient()
  const { setCart, setError } = useCartStore()

  return useMutation({
    mutationFn: (data: UpdateCartItemData) => cartApi.updateItem(data),
    onSuccess: (cart) => {
      setCart(cart)
      queryClient.setQueryData(CART_QUERY_KEYS.cart, cart)
    },
    onError: (error) => {
      setError(
        error instanceof Error ? error.message : 'Failed to update cart item'
      )
    },
  })
}

/**
 * Remove item from cart
 */
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient()
  const { setCart, setError } = useCartStore()

  return useMutation({
    mutationFn: (variantId: number) => cartApi.removeItem(variantId),
    onSuccess: (cart) => {
      setCart(cart)
      queryClient.setQueryData(CART_QUERY_KEYS.cart, cart)
    },
    onError: (error) => {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to remove item from cart'
      )
    },
  })
}

/**
 * Clear entire cart
 */
export const useClearCart = () => {
  const queryClient = useQueryClient()
  const { setCart, setError } = useCartStore()

  return useMutation({
    mutationFn: () => cartApi.clear(),
    onSuccess: (cart) => {
      setCart(cart)
      queryClient.setQueryData(CART_QUERY_KEYS.cart, cart)
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'Failed to clear cart')
    },
  })
}

/**
 * Get cart item count for header badge
 */
export const useCartCount = () => {
  const totalItems = useCartStore((state) => state.totalItems)
  return totalItems
}

/**
 * Get cart total price
 */
export const useCartTotal = () => {
  const totalPrice = useCartStore((state) => state.totalPrice)
  return totalPrice
}

/**
 * Check if product variant is in cart and get quantity
 */
export const useCartItemCount = (variantId: number) => {
  const itemCount = useCartStore((state) => state.itemCount)
  return itemCount(variantId)
}

/**
 * Check if product variant is in cart
 */
export const useIsInCart = (variantId: number) => {
  const itemCount = useCartItemCount(variantId)
  return itemCount > 0
}
