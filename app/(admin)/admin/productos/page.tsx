import Link from 'next/link'
import { Plus } from 'lucide-react'
import AdminProductsTable from '@/components/admin/AdminProductsTable'
import { getAdminProducts } from '@/lib/catalog'

export default async function AdminProductsPage() {
  const products = await getAdminProducts()

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-rubber">Catalogo</p>
          <h1 className="font-display text-6xl font-bold text-[#121629]">Productos y stock</h1>
        </div>
        <Link href="/admin/productos/nuevo" className="inline-flex items-center gap-2 rounded-md bg-rubber px-5 py-3 text-sm font-black uppercase text-white"><Plus size={18} /> Nuevo producto</Link>
      </div>

      <AdminProductsTable products={products} />
    </>
  )
}
