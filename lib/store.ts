'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  slug: string
  name: string
  brand: string
  image: string
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, qty: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const current = state.items.find((entry) => entry.productId === item.productId)
          if (!current) return { items: [...state.items, item] }

          return {
            items: state.items.map((entry) =>
              entry.productId === item.productId ? { ...entry, quantity: entry.quantity + item.quantity } : entry
            )
          }
        }),
      removeItem: (productId) => set((state) => ({ items: state.items.filter((item) => item.productId !== productId) })),
      updateQuantity: (productId, qty) =>
        set((state) => ({
          items: qty <= 0 ? state.items.filter((item) => item.productId !== productId) : state.items.map((item) => (item.productId === productId ? { ...item, quantity: qty } : item))
        })),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0)
    }),
    { name: 'neumaticos-cart' }
  )
)
