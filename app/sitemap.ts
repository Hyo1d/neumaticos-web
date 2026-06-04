import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/catalog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const products = await getProducts()

  return [
    { url: baseUrl },
    { url: `${baseUrl}/catalogo` },
    { url: `${baseUrl}/buscar` },
    ...products.map((product) => ({ url: `${baseUrl}/catalogo/${product.slug}` }))
  ]
}
