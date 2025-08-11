/**
 * Catalog hooks using TanStack Query
 */

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { catalogApi } from '../api'

// Query keys for consistency
export const CATALOG_QUERY_KEYS = {
  products: {
    all: ['catalog', 'products'] as const,
    infinite: (filters?: Record<string, unknown>) =>
      ['catalog', 'products', 'infinite', filters] as const,
    detail: (id: number) => ['catalog', 'products', id] as const,
    slug: (slug: string) => ['catalog', 'products', 'slug', slug] as const,
    featured: ['catalog', 'products', 'featured'] as const,
    onSale: ['catalog', 'products', 'on-sale'] as const,
  },
  collections: {
    all: ['catalog', 'collections'] as const,
    detail: (id: number) => ['catalog', 'collections', id] as const,
    welcome: ['catalog', 'collections', 'welcome'] as const,
  },
  categories: {
    all: ['catalog', 'categories'] as const,
    detail: (id: number) => ['catalog', 'categories', id] as const,
  },
  wishlist: ['catalog', 'wishlist'] as const,
  sizes: ['catalog', 'sizes'] as const,
  colors: ['catalog', 'colors'] as const,
}

/**
 * Get products with pagination
 */
export const useProducts = (filters?: {
  category?: string
  collection?: string
  gender?: string
  search?: string
  is_featured?: boolean
  is_on_sale?: boolean
}) => {
  return useQuery({
    queryKey: [...CATALOG_QUERY_KEYS.products.all, filters],
    queryFn: () =>
      catalogApi.products.getAll({ ...filters, page: 1, page_size: 20 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Infinite products query for pagination
 */
export const useInfiniteProducts = (filters?: {
  category?: string
  collection?: string
  gender?: string
  search?: string
  is_featured?: boolean
  is_on_sale?: boolean
}) => {
  return useInfiniteQuery({
    queryKey: CATALOG_QUERY_KEYS.products.infinite(filters),
    queryFn: ({ pageParam = 1 }) =>
      catalogApi.products.getAll({
        ...filters,
        page: pageParam,
        page_size: 20,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next)
        return parseInt(url.searchParams.get('page') || '1')
      }
      return undefined
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Get product by ID
 */
export const useProduct = (id: number) => {
  return useQuery({
    queryKey: CATALOG_QUERY_KEYS.products.detail(id),
    queryFn: () => catalogApi.products.getById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Get product by slug
 */
export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: CATALOG_QUERY_KEYS.products.slug(slug),
    queryFn: () => catalogApi.products.getBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  })
}

/**
 * Get featured products
 */
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: CATALOG_QUERY_KEYS.products.featured,
    queryFn: () => catalogApi.products.getFeatured(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

/**
 * Get products on sale
 */
export const useOnSaleProducts = () => {
  return useQuery({
    queryKey: CATALOG_QUERY_KEYS.products.onSale,
    queryFn: () => catalogApi.products.getOnSale(),
    staleTime: 15 * 60 * 1000,
  })
}

/**
 * Get all collections
 */
export const useCollections = () => {
  return useQuery({
    queryKey: CATALOG_QUERY_KEYS.collections.all,
    queryFn: () => catalogApi.collections.getAll(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

/**
 * Get welcome page collections
 */
export const useWelcomeCollections = () => {
  return useQuery({
    queryKey: CATALOG_QUERY_KEYS.collections.welcome,
    queryFn: () => catalogApi.collections.getWelcomeCollections(),
    staleTime: 30 * 60 * 1000,
  })
}

/**
 * Get collection by ID
 */
export const useCollection = (id: number) => {
  return useQuery({
    queryKey: CATALOG_QUERY_KEYS.collections.detail(id),
    queryFn: () => catalogApi.collections.getById(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  })
}

/**
 * Get all categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: CATALOG_QUERY_KEYS.categories.all,
    queryFn: () => catalogApi.categories.getAll(),
    staleTime: 30 * 60 * 1000,
  })
}

/**
 * Get sizes
 */
export const useSizes = () => {
  return useQuery({
    queryKey: CATALOG_QUERY_KEYS.sizes,
    queryFn: () => catalogApi.sizes.getAll(),
    staleTime: 60 * 60 * 1000, // 1 hour
  })
}

/**
 * Get colors
 */
export const useColors = () => {
  return useQuery({
    queryKey: CATALOG_QUERY_KEYS.colors,
    queryFn: () => catalogApi.colors.getAll(),
    staleTime: 60 * 60 * 1000,
  })
}

/**
 * Get wishlist items
 */
export const useWishlist = () => {
  return useQuery({
    queryKey: CATALOG_QUERY_KEYS.wishlist,
    queryFn: () => catalogApi.wishlist.getItems(),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

/**
 * Add item to wishlist
 */
export const useAddToWishlist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variant_id: number) => catalogApi.wishlist.addItem(variant_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATALOG_QUERY_KEYS.wishlist })
    },
  })
}

/**
 * Remove item from wishlist
 */
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => catalogApi.wishlist.removeItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATALOG_QUERY_KEYS.wishlist })
    },
  })
}
