import type { Brand, Category, Product } from '@/lib/types'
import { createProductAction, updateProductAction } from '@/app/(admin)/admin/productos/actions'

type ProductFormProps = {
  mode?: 'create' | 'edit'
  brands: Brand[]
  categories: Category[]
  product?: Product
}

export default function ProductForm({ mode = 'create', brands, categories, product }: ProductFormProps) {
  const action = mode === 'edit' ? updateProductAction : createProductAction

  return (
    <form action={action} className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      {product && <input type="hidden" name="id" value={product.id} />}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
          Nombre
          <input name="name" defaultValue={product?.name} required className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" placeholder="Ej: Primacy 4 205/55 R16" />
        </label>
        <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
          Slug
          <input name="slug" defaultValue={product?.slug} required className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" placeholder="primacy-4-205-55-r16" />
        </label>
        <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
          Marca
          <select name="brand_id" defaultValue={product?.brand.id} required className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm">
            {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
          Categoria
          <select name="category_id" defaultValue={product?.category.id} required className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm">
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
          Ancho
          <input name="width" defaultValue={product?.width} required className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" placeholder="205" type="number" />
        </label>
        <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
          Perfil
          <input name="aspect_ratio" defaultValue={product?.aspectRatio} required className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" placeholder="55" type="number" />
        </label>
        <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
          Rodado
          <input name="rim_size" defaultValue={product?.rimSize} required className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" placeholder="16" type="number" />
        </label>
        <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
          Stock
          <input name="stock" defaultValue={product?.stock ?? 0} required className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" placeholder="8" type="number" />
        </label>
        <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
          Precio
          <input name="price" defaultValue={product?.price} required className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" placeholder="238500" type="number" />
        </label>
        <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
          Precio comparacion
          <input name="price_compare" defaultValue={product?.priceCompare} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" placeholder="260000" type="number" />
        </label>
        <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
          Indice carga
          <input name="load_index" defaultValue={product?.loadIndex} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" placeholder="91" />
        </label>
        <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
          Codigo velocidad
          <input name="speed_rating" defaultValue={product?.speedRating} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" placeholder="V" />
        </label>
      </div>
      <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
        Imagen principal por URL
        <input name="image" defaultValue={product?.images[0] ?? '/fantini-hero-tires.png'} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" placeholder="/producto.png" />
      </label>
      <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
        Subir imagen principal
        <input name="image_file" type="file" accept="image/*" className="rounded-md border border-slate-200 bg-white px-3 py-3 text-sm" />
      </label>
      <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
        Tags
        <input name="tags" defaultValue={product?.tags.join(', ')} className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm" placeholder="premium, ruta, oferta" />
      </label>
      <label className="grid gap-1 text-xs font-black uppercase text-slate-500">
        Descripcion
        <textarea name="description" defaultValue={product?.description} className="min-h-28 rounded-md border border-slate-200 bg-white px-3 py-3 text-sm" placeholder="Descripcion comercial del producto" />
      </label>
      <div className="flex flex-wrap gap-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-600">
        <label className="inline-flex items-center gap-2"><input name="is_featured" type="checkbox" defaultChecked={product?.isFeatured} /> Destacado</label>
        <label className="inline-flex items-center gap-2"><input name="is_active" type="checkbox" defaultChecked={product?.isActive !== false} /> Activo</label>
      </div>
      <div className="flex flex-wrap justify-end gap-3">
        <button type="button" className="rounded-md border border-slate-200 px-5 py-3 text-sm font-black text-slate-700">Guardar borrador</button>
        <button className="rounded-md bg-rubber px-5 py-3 text-sm font-black uppercase text-white">{mode === 'edit' ? 'Guardar cambios' : 'Crear producto'}</button>
      </div>
    </form>
  )
}
