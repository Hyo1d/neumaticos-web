import { notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'
import SupabaseNotice from '@/components/admin/SupabaseNotice'
import { getBrands, getCategories, getProductById } from '@/lib/catalog'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [brands, categories, product] = await Promise.all([getBrands(), getCategories(), getProductById(params.id)])
  if (!product) notFound()

  return (
    <>
      <p className="text-sm font-black uppercase text-rubber">Producto {params.id}</p>
      <h1 className="font-display text-6xl font-bold text-[#121629]">Editar producto</h1>
      <div className="mt-8"><SupabaseNotice /><ProductForm mode="edit" brands={brands} categories={categories} product={product} /></div>
    </>
  )
}
