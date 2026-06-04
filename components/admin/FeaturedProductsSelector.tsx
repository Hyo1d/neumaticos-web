'use client'

import { useMemo, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, Search, Star, X } from 'lucide-react'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

type FeaturedProductsSelectorProps = {
  products: Product[]
}

const pageSize = 12
const maxFeaturedProducts = 8

export default function FeaturedProductsSelector({ products }: FeaturedProductsSelectorProps) {
  const [selectedIds, setSelectedIds] = useState(() => new Set(products.filter((product) => product.isFeatured).map((product) => product.id)))
  const [query, setQuery] = useState('')
  const [brand, setBrand] = useState('all')
  const [category, setCategory] = useState('all')
  const [rimSize, setRimSize] = useState('all')
  const [page, setPage] = useState(1)

  const brands = useMemo(() => Array.from(new Set(products.map((product) => product.brand.name))).sort(), [products])
  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category.name))).sort(), [products])
  const rimSizes = useMemo(() => Array.from(new Set(products.map((product) => product.rimSize))).sort((a, b) => a - b), [products])

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return products.filter((product) => {
      const matchesQuery =
        !needle ||
        `${product.name} ${product.slug} ${product.brand.name} ${product.category.name} ${product.width}/${product.aspectRatio} r${product.rimSize} ${product.tags.join(' ')}`
          .toLowerCase()
          .includes(needle)

      return (
        matchesQuery &&
        (brand === 'all' || product.brand.name === brand) &&
        (category === 'all' || product.category.name === category) &&
        (rimSize === 'all' || product.rimSize === Number(rimSize))
      )
    })
  }, [brand, category, products, query, rimSize])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visibleProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const selectedProducts = products.filter((product) => selectedIds.has(product.id))

  function updateFilter(update: () => void) {
    update()
    setPage(1)
  }

  function toggleProduct(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else if (next.size < maxFeaturedProducts) {
        next.add(id)
      } else {
        return next
      }
      return next
    })
  }

  function clearFilters() {
    setQuery('')
    setBrand('all')
    setCategory('all')
    setRimSize('all')
    setPage(1)
  }

  return (
    <div className="mt-5 grid gap-5">
      {Array.from(selectedIds).map((id) => (
        <input key={id} type="hidden" name="product_id" value={id} />
      ))}

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[1fr_180px_180px_140px_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={query}
            onChange={(event) => updateFilter(() => setQuery(event.target.value))}
            className="h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm font-semibold outline-none focus:border-rubber focus:ring-4 focus:ring-rubber/10"
            placeholder="Buscar por modelo, medida, marca o tag"
          />
        </label>

        <select value={brand} onChange={(event) => updateFilter(() => setBrand(event.target.value))} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold">
          <option value="all">Todas las marcas</option>
          {brands.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>

        <select value={category} onChange={(event) => updateFilter(() => setCategory(event.target.value))} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold">
          <option value="all">Categorias</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>

        <select value={rimSize} onChange={(event) => updateFilter(() => setRimSize(event.target.value))} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold">
          <option value="all">Rodados</option>
          {rimSizes.map((item) => <option key={item} value={item}>R{item}</option>)}
        </select>

        <button type="button" onClick={clearFilters} className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-black text-slate-600">
          <X size={16} />
          Limpiar
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-bold text-slate-600">
        <span>{filteredProducts.length} productos encontrados</span>
        <span className="inline-flex items-center gap-2 rounded-md bg-rubber px-3 py-2 text-white">
          <Star size={16} />
          {selectedIds.size}/{maxFeaturedProducts} destacados seleccionados
        </span>
      </div>

      {selectedIds.size >= maxFeaturedProducts && (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">
          Alcanzaste el maximo de {maxFeaturedProducts} productos destacados. Quita uno para elegir otro.
        </p>
      )}

      {selectedProducts.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-black uppercase text-slate-500">Seleccionados</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedProducts.map((product) => (
              <button key={product.id} type="button" onClick={() => toggleProduct(product.id)} className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 hover:bg-red-50 hover:text-red-700">
                {product.name}
                <X size={14} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-black uppercase text-slate-500">
            <tr>
              <th className="w-16 p-3">Elegir</th>
              <th>Producto</th>
              <th>Medida</th>
              <th>Marca</th>
              <th>Categoria</th>
              <th>Stock</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {visibleProducts.map((product) => {
              const isSelected = selectedIds.has(product.id)

              return (
                <tr key={product.id} className={isSelected ? 'border-t border-slate-100 bg-rubber/5' : 'border-t border-slate-100'}>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => toggleProduct(product.id)}
                      disabled={!isSelected && selectedIds.size >= maxFeaturedProducts}
                      className={isSelected ? 'grid h-9 w-9 place-items-center rounded-md bg-rubber text-white' : 'grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white text-slate-400 disabled:cursor-not-allowed disabled:opacity-40'}
                      aria-label={isSelected ? 'Quitar destacado' : 'Marcar destacado'}
                    >
                      {isSelected ? <Check size={18} /> : <Star size={17} />}
                    </button>
                  </td>
                  <td className="font-black text-[#121629]">{product.name}</td>
                  <td>{product.width}/{product.aspectRatio} R{product.rimSize}</td>
                  <td>{product.brand.name}</td>
                  <td>{product.category.name}</td>
                  <td className={product.stock <= 5 ? 'font-black text-amber-600' : 'font-black text-emerald-700'}>{product.stock}</td>
                  <td className="font-black text-rubber">{formatPrice(product.price)}</td>
                </tr>
              )
            })}

            {visibleProducts.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center font-bold text-slate-500">No hay productos para esos filtros.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-500">Pagina {currentPage} de {totalPages}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 disabled:opacity-50">
            <ChevronLeft size={16} />
            Anterior
          </button>
          <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 disabled:opacity-50">
            Siguiente
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
