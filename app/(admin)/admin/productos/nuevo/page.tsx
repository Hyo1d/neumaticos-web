import ProductForm from '@/components/admin/ProductForm'
import SupabaseNotice from '@/components/admin/SupabaseNotice'
import { getBrands, getCategories } from '@/lib/catalog'

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([getBrands(), getCategories()])

  return (
    <>
      <p className="text-sm font-black uppercase text-rubber">Catalogo</p>
      <h1 className="font-display text-6xl font-bold text-[#121629]">Nuevo producto</h1>
      <div className="mt-8"><SupabaseNotice /><ProductForm brands={brands} categories={categories} /></div>
    </>
  )
}
