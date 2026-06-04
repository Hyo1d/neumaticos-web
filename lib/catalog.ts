import { unstable_noStore as noStore } from 'next/cache'
import { brands as fallbackBrands, categories as fallbackCategories, getProductBySlug as fallbackProductBySlug, products as fallbackProducts, searchProducts as fallbackSearchProducts } from '@/lib/data'
import type { Brand, Category, Product } from '@/lib/types'
import { parseTireSize } from '@/lib/utils'
import { createAdminClient } from '@/lib/supabase/admin'

type ProductRow = {
  id: string
  slug: string
  name: string
  description: string | null
  width: number | null
  aspect_ratio: number | null
  rim_size: number | null
  load_index: string | null
  speed_rating: string | null
  price: number | string
  price_compare: number | string | null
  stock: number | null
  images: string[] | null
  tags: string[] | null
  is_featured: boolean | null
  is_active: boolean | null
  brand: { id: string; slug: string; name: string; logo_url?: string | null } | null
  category: { id: string; slug: string; name: string; icon?: string | null } | null
}

type BrandRow = { id: string; slug: string; name: string; logo_url?: string | null }

function mapBrand(row: BrandRow): Brand {
  return { id: row.id, slug: row.slug, name: row.name, logoUrl: row.logo_url ?? undefined }
}

function canReadSupabase() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

function isMissingTableError(error: { message?: string; code?: string }) {
  return error.code === 'PGRST205' || error.message?.includes('Could not find the table')
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand ? mapBrand(row.brand) : fallbackBrands[0],
    category: row.category ? { id: row.category.id, slug: row.category.slug, name: row.category.name, icon: row.category.icon ?? '' } : fallbackCategories[0],
    description: row.description ?? '',
    width: row.width ?? 0,
    aspectRatio: row.aspect_ratio ?? 0,
    rimSize: row.rim_size ?? 0,
    loadIndex: row.load_index ?? '',
    speedRating: row.speed_rating ?? '',
    price: Number(row.price),
    priceCompare: row.price_compare ? Number(row.price_compare) : undefined,
    stock: row.stock ?? 0,
    images: row.images?.length ? row.images : ['/fantini-hero-tires.png'],
    tags: row.tags ?? [],
    isFeatured: Boolean(row.is_featured),
    isActive: row.is_active !== false
  }
}

async function fetchProductsFromSupabase({ activeOnly = true } = {}) {
  const supabase = createAdminClient()
  if (!supabase) return null

  let query = supabase
    .from('products')
    .select('id, slug, name, description, width, aspect_ratio, rim_size, load_index, speed_rating, price, price_compare, stock, images, tags, is_featured, is_active, brand:brands(id, slug, name, logo_url), category:categories(id, slug, name, icon)')
    .order('created_at', { ascending: false })

  if (activeOnly) query = query.eq('is_active', true)

  const { data, error } = await query

  if (error) {
    if (isMissingTableError(error)) return null
    throw new Error(error.message)
  }

  return (data as unknown as ProductRow[]).map(mapProduct)
}

export async function getBrands() {
  noStore()
  if (!canReadSupabase()) return fallbackBrands
  const supabase = createAdminClient()
  if (!supabase) return fallbackBrands

  const { data, error } = await supabase.from('brands').select('id, slug, name, logo_url').eq('is_active', true).order('name')
  if (error) {
    if (isMissingTableError(error)) return fallbackBrands
    throw new Error(error.message)
  }
  return ((data ?? []) as BrandRow[]).map(mapBrand)
}

export async function getCategories() {
  noStore()
  if (!canReadSupabase()) return fallbackCategories
  const supabase = createAdminClient()
  if (!supabase) return fallbackCategories

  const { data, error } = await supabase.from('categories').select('id, slug, name, icon').eq('is_active', true).order('name')
  if (error) {
    if (isMissingTableError(error)) return fallbackCategories
    throw new Error(error.message)
  }
  return (data ?? []) as Category[]
}

export async function getProducts() {
  noStore()
  if (!canReadSupabase()) return fallbackProducts
  return (await fetchProductsFromSupabase()) ?? fallbackProducts
}

export async function getAdminProducts() {
  noStore()
  if (!canReadSupabase()) return fallbackProducts
  return (await fetchProductsFromSupabase({ activeOnly: false })) ?? fallbackProducts
}

export async function getFeaturedProducts() {
  const items = await getProducts()
  return items.filter((product) => product.isFeatured)
}

export async function getProductBySlug(slug: string) {
  noStore()
  if (!canReadSupabase()) return fallbackProductBySlug(slug)
  const items = await getProducts()
  return items.find((product) => product.slug === slug)
}

export async function getProductById(id: string) {
  const items = await getProducts()
  return items.find((product) => product.id === id)
}

export async function searchProducts(query?: string, filters?: Partial<Pick<Product, 'width' | 'aspectRatio' | 'rimSize'>>) {
  const items = await getProducts()
  if (!canReadSupabase()) return fallbackSearchProducts(query, filters)

  return items.filter((product) => {
    const byFilters =
      (!filters?.width || product.width === filters.width) &&
      (!filters?.aspectRatio || product.aspectRatio === filters.aspectRatio) &&
      (!filters?.rimSize || product.rimSize === filters.rimSize)

    if (!query) return byFilters

    const parsed = parseTireSize(query)
    if (parsed) {
      return product.width === parsed.width && product.aspectRatio === parsed.aspectRatio && product.rimSize === parsed.rimSize
    }

    const needle = query.toLowerCase()
    const haystack = `${product.name} ${product.slug} ${product.brand.name} ${product.brand.slug} ${product.category.name} ${product.category.slug} ${product.tags.join(' ')}`.toLowerCase()
    return byFilters && haystack.includes(needle)
  })
}
