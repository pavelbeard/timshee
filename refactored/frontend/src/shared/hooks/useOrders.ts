/**
 * Order hooks using TanStack Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { ordersApi } from '../api';

// Query keys for consistency
export const ORDER_QUERY_KEYS = {
  orders: {
    all: ['orders'] as const,
    detail: (id: number) => ['orders', id] as const,
    list: (filters?: Record<string, unknown>) =>
      ['orders', 'list', filters] as const,
  },
  checkout: ['checkout'] as const,
}

/**
 * Get user's orders with pagination
 */
export const useOrders = (filters?: {
  status?: string
  page?: number
  page_size?: number
}) => {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.orders.list(filters),
    queryFn: () => {
      // TODO: Implement ordersApi.getAll(filters)
      throw new Error('Orders API not implemented yet')
    },
    enabled: false, // Disable until API is implemented
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

/**
 * Get order by ID
 */
export const useOrder = (id: number) => {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.orders.detail(id),
    queryFn: () => {
      // TODO: Implement ordersApi.getById(id)
      throw new Error('Orders API not implemented yet')
    },
    enabled: false, // Disable until API is implemented
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Create new order
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      // TODO: Implement ordersApi.create(data)
      throw new Error('Orders API not implemented yet')
    },
    onSuccess: () => {
      // Invalidate orders list to show new order
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.orders.all })
      // Clear cart cache as items should be removed after order creation
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

/**
 * Update order status (for admin)
 */
export const useUpdateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      // TODO: Implement ordersApi.update(id, data)
      throw new Error('Orders API not implemented yet')
    },
    onSuccess: (updatedOrder: { id: number }) => {
      // Update the specific order in cache
      queryClient.setQueryData(
        ORDER_QUERY_KEYS.orders.detail(updatedOrder.id),
        updatedOrder
      )
      // Invalidate orders list to refresh status
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.orders.all })
    },
  })
}

/**
 * Cancel order
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      // TODO: Implement ordersApi.cancel(id)
      throw new Error('Orders API not implemented yet')
    },
    onSuccess: (cancelledOrder: { id: number }) => {
      // Update the specific order in cache
      queryClient.setQueryData(
        ORDER_QUERY_KEYS.orders.detail(cancelledOrder.id),
        cancelledOrder
      )
      // Invalidate orders list to refresh status
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.orders.all })
    },
  })
}

/**
 * Get checkout information
 */
export const useCheckout = () => {
  return useQuery({
    queryKey: ORDER_QUERY_KEYS.checkout,
    queryFn: () => {
      // TODO: Implement ordersApi.getCheckoutInfo()
      throw new Error('Orders API not implemented yet')
    },
    enabled: false, // Disable until API is implemented
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Track order status
 */
export const useOrderTracking = (trackingNumber: string) => {
  return useQuery({
    queryKey: ['orders', 'tracking', trackingNumber],
    queryFn: () => {
      // TODO: Implement ordersApi.trackOrder(trackingNumber)
      throw new Error('Orders API not implemented yet')
    },
    enabled: false, // Disable until API is implemented
    staleTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time tracking
  })
}
