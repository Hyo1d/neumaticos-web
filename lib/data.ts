import type { Brand, Category, Product } from '@/lib/types'
import { parseTireSize } from '@/lib/utils'

export const brands: Brand[] = [
  { id: 'b1', slug: 'green-trac', name: 'Greentrac', logoUrl: '/brand-logos/greentrac-local.png' },
  { id: 'b2', slug: 'michelin', name: 'Michelin', logoUrl: '/brand-logos/michelin.svg' },
  { id: 'b3', slug: 'firestone', name: 'Firestone', logoUrl: '/brand-logos/firestone-local.svg' },
  { id: 'b4', slug: 'giti', name: 'Giti', logoUrl: '/brand-logos/giti-local.png' },
  { id: 'b5', slug: 'bridgestone', name: 'Bridgestone', logoUrl: '/brand-logos/bridgestone-local.svg' },
  { id: 'b6', slug: 'pirelli', name: 'Pirelli', logoUrl: '/brand-logos/pirelli-cropped.png' },
  { id: 'b7', slug: 'goodyear', name: 'Goodyear', logoUrl: '/brand-logos/goodyear-local.svg' },
  { id: 'b8', slug: 'bf-goodrich', name: 'BFGoodrich', logoUrl: '/brand-logos/bf-goodrich-cropped.png' },
  { id: 'b9', slug: 'fate', name: 'Fate', logoUrl: '/brand-logos/fate-local.png' },
  { id: 'b10', slug: 'wanli', name: 'Wanli', logoUrl: '/brand-logos/extra-local.png' }
]

export const categories: Category[] = [
  { id: 'c1', slug: 'auto', name: 'Auto', icon: 'Car' },
  { id: 'c2', slug: 'suv', name: 'SUV', icon: 'Badge' },
  { id: 'c3', slug: 'camionetas', name: 'Camionetas', icon: 'Truck' },
  { id: 'c4', slug: 'deportivo', name: 'Deportivo', icon: 'Gauge' }
]

const image = '/fantini-hero-tires.png'

const brandBySlug = (slug: string) => brands.find((brand) => brand.slug === slug) ?? brands[0]
const categoryBySlug = (slug: string) => categories.find((category) => category.slug === slug) ?? categories[0]

export const products: Product[] = [
  {
    id: 'p1',
    slug: 'green-trac-quest-x-185-65-r15',
    name: 'Quest-X 185/65 R15',
    brand: brandBySlug('green-trac'),
    category: categoryBySlug('auto'),
    description: 'Neumático equilibrado para uso urbano y ruta, con buen agarre y respuesta diaria.',
    width: 185,
    aspectRatio: 65,
    rimSize: 15,
    loadIndex: '88',
    speedRating: 'H',
    price: 129900,
    priceCompare: 151000,
    stock: 12,
    images: [image],
    tags: ['urbano', 'ruta', 'precio contado'],
    isFeatured: true
  },
  {
    id: 'p2',
    slug: 'michelin-primacy-4-205-55-r16',
    name: 'Primacy 4 205/55 R16',
    brand: brandBySlug('michelin'),
    category: categoryBySlug('auto'),
    description: 'Cubierta premium enfocada en seguridad, durabilidad y adherencia constante durante su vida útil.',
    width: 205,
    aspectRatio: 55,
    rimSize: 16,
    loadIndex: '91',
    speedRating: 'V',
    price: 238500,
    stock: 8,
    images: [image],
    tags: ['premium', 'seguridad'],
    isFeatured: true
  },
  {
    id: 'p3',
    slug: 'bridgestone-dueler-225-65-r17',
    name: 'Dueler H/T 225/65 R17',
    brand: brandBySlug('bridgestone'),
    category: categoryBySlug('suv'),
    description: 'Diseño para SUV con conducción estable, buen confort y desempeño confiable en asfalto.',
    width: 225,
    aspectRatio: 65,
    rimSize: 17,
    loadIndex: '102',
    speedRating: 'H',
    price: 289000,
    stock: 5,
    images: [image],
    tags: ['suv', 'confort'],
    isFeatured: true
  },
  {
    id: 'p4',
    slug: 'firestone-f600-175-70-r13',
    name: 'F600 175/70 R13',
    brand: brandBySlug('firestone'),
    category: categoryBySlug('auto'),
    description: 'Opción nacional confiable para autos compactos, con gran relación precio-prestación.',
    width: 175,
    aspectRatio: 70,
    rimSize: 13,
    loadIndex: '82',
    speedRating: 'T',
    price: 88900,
    stock: 20,
    images: [image],
    tags: ['nacional', 'compacto'],
    isFeatured: false
  }
]

export function getFeaturedProducts() {
  return products.filter((product) => product.isFeatured)
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug)
}

function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function searchProducts(query?: string, filters?: Partial<Pick<Product, 'width' | 'aspectRatio' | 'rimSize'>>) {
  return products.filter((product) => {
    const byFilters =
      (!filters?.width || product.width === filters.width) &&
      (!filters?.aspectRatio || product.aspectRatio === filters.aspectRatio) &&
      (!filters?.rimSize || product.rimSize === filters.rimSize)

    if (!query) return byFilters

    const parsed = parseTireSize(query)
    if (parsed) {
      return product.width === parsed.width && product.aspectRatio === parsed.aspectRatio && product.rimSize === parsed.rimSize
    }

    const haystack = normalizeSearch(`${product.name} ${product.slug} ${product.brand.name} ${product.brand.slug} ${product.category.name} ${product.category.slug} ${product.tags.join(' ')}`)
    const needle = normalizeSearch(query)
    return byFilters && haystack.includes(needle)
  })
}
