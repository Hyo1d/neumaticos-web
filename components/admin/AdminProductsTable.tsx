'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Eye, RotateCcw, Search, Trash2, X } from 'lucide-react'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { toggleProductActiveAction } from '@/app/(admin)/admin/productos/actions'

type AdminProductsTableProps = {
  products: Product[]
}

const pageSize = 15

export default function AdminProductsTable({ products }: AdminProductsTableProps) {
  const [query, setQuery] = useState('')
  const [brand, setBrand] = useState('all')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('active')
  const [page, setPage] = useState(1)

  const brands = Array.from(new Set(products.map((product) => product.brand.name))).sort()
  const categories = Array.from(new Set(products.map((product) => product.category.name))).sort()

  const filtered = products.filter((product) => {
    const needle = query.trim().toLowerCase()
    const matchesQuery =
      !needle ||
      `${product.name} ${product.slug} ${product.brand.name} ${product.category.name} ${product.width}/${product.aspectRatio} r${product.rimSize} ${product.tags.join(' ')}`
        .toLowerCase()
        .includes(needle)
    const matchesStatus = status === 'all' || (status === 'active' ? product.isActive !== false : product.isActive === false)

    return matchesQuery && matchesStatus && (brand === 'all' || product.brand.name === brand) && (category === 'all' || product.category.name === category)
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function resetPage(update: () => void) {
    update()
    setPage(1)
  }

  return (
    <div className="mt-8 grid gap-4">
      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_180px_180px_150px_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={query}
            onChange={(event) => resetPage(() => setQuery(event.target.value))}
            className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-semibold outline-none focus:border-rubber focus:ring-4 focus:ring-rubber/10"
            placeholder="Buscar por modelo, medida, marca o tag"
          />
        </label>
        <select value={brand} onChange={(event) => resetPage(() => setBrand(event.target.value))} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold">
          <option value="all">Todas las marcas</option>
          {brands.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={category} onChange={(event) => resetPage(() => setCategory(event.target.value))} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold">
          <option value="all">Categorias</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={status} onChange={(event) => resetPage(() => setStatus(event.target.value))} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold">
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
          <option value="all">Todos</option>
        </select>
        <button type="button" onClick={() => resetPage(() => { setQuery(''); setBrand('all'); setCategory('all'); setStatus('active') })} className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-black text-slate-600">
          <X size={16} />
          Limpiar
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-bold text-slate-600">
        <span>{filtered.length} productos encontrados</span>
        <span>Pagina {currentPage} de {totalPages}</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-black uppercase text-slate-500">
            <tr>
              <th className="p-3">Producto</th>
              <th>Medida</th>
              <th>Marca</th>
              <th>Categoria</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((product) => {
              const isLowStock = product.stock <= 5
              const isActive = product.isActive !== false

              return (
                <tr key={product.id} className="border-t border-slate-100 text-slate-700">
                  <td className="p-3 font-black text-[#121629]">{product.name}</td>
                  <td>{product.width}/{product.aspectRatio} R{product.rimSize}</td>
                  <td>{product.brand.name}</td>
                  <td>{product.category.name}</td>
                  <td><span className={isLowStock ? 'font-black text-amber-600' : 'font-black text-emerald-700'}>{product.stock}</span></td>
                  <td className="font-black text-[#121629]">{formatPrice(product.price)}</td>
                  <td>
                    <span className={isActive ? 'rounded-full bg-emerald-50 px-2 py-1 text-xs font-black text-emerald-700' : 'rounded-full bg-slate-100 px-2 py-1 text-xs font-black text-slate-500'}>
                      {isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="flex gap-2 py-3">
                    {isActive && <Link href={`/catalogo/${product.slug}`} className="rounded-md border border-slate-200 p-2 text-slate-600" aria-label="Ver producto"><Eye size={16} /></Link>}
                    <Link href={`/admin/productos/${product.id}`} className="rounded-md border border-slate-200 p-2 text-rubber" aria-label="Editar producto"><Edit size={16} /></Link>
                    <form action={toggleProductActiveAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="is_active" value={isActive ? 'false' : 'true'} />
                      <button className={isActive ? 'rounded-md border border-slate-200 p-2 text-red-600' : 'rounded-md border border-slate-200 p-2 text-emerald-700'} aria-label={isActive ? 'Desactivar producto' : 'Reactivar producto'}>
                        {isActive ? <Trash2 size={16} /> : <RotateCcw size={16} />}
                      </button>
                    </form>
                  </td>
                </tr>
              )
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center font-bold text-slate-500">No hay productos para esos filtros.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 disabled:opacity-50">Anterior</button>
        <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages} className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 disabled:opacity-50">Siguiente</button>
      </div>
    </div>
  )
}
