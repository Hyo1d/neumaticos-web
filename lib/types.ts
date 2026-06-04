export type Brand = {
  id: string
  slug: string
  name: string
  logoUrl?: string
}

export type Category = {
  id: string
  slug: string
  name: string
  icon: string
}

export type Product = {
  id: string
  slug: string
  name: string
  brand: Brand
  category: Category
  description: string
  width: number
  aspectRatio: number
  rimSize: number
  loadIndex: string
  speedRating: string
  price: number
  priceCompare?: number
  stock: number
  images: string[]
  tags: string[]
  isFeatured: boolean
  isActive?: boolean
}

export type HeroSlide = {
  eyebrow: string
  title: string
  text: string
  cta: string
  href: string
  image: string
  imageAlt: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
