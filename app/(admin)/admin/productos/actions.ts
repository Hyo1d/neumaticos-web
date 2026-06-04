'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  brand_id: z.string().min(1),
  category_id: z.string().min(1),
  description: z.string().optional(),
  width: z.coerce.number().int().positive(),
  aspect_ratio: z.coerce.number().int().positive(),
  rim_size: z.coerce.number().int().positive(),
  load_index: z.string().optional(),
  speed_rating: z.string().optional(),
  stock: z.coerce.number().int().min(0),
  price: z.coerce.number().positive(),
  price_compare: z.coerce.number().optional(),
  image: z.string().optional(),
  tags: z.string().optional(),
  is_featured: z.string().optional(),
  is_active: z.string().optional()
})

function sanitizeFileName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9.-]+/g, '-').replace(/^-+|-+$/g, '')
}

async function getImageUrl(formData: FormData, fallback: string) {
  const supabase = createAdminClient()
  const file = formData.get('image_file')

  if (!supabase || !(file instanceof File) || file.size === 0) return fallback

  await supabase.storage.createBucket('product-images', { public: true }).catch(() => null)

  const ext = file.name.split('.').pop() ?? 'png'
  const path = `${Date.now()}-${sanitizeFileName(file.name || `producto.${ext}`)}`
  const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: false })
  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data.publicUrl
}

async function payloadFromForm(formData: FormData) {
  const parsed = productSchema.parse(Object.fromEntries(formData))
  const imageUrl = await getImageUrl(formData, parsed.image || '/fantini-hero-tires.png')

  return {
    slug: parsed.slug,
    name: parsed.name,
    brand_id: parsed.brand_id,
    category_id: parsed.category_id,
    description: parsed.description ?? '',
    width: parsed.width,
    aspect_ratio: parsed.aspect_ratio,
    rim_size: parsed.rim_size,
    load_index: parsed.load_index ?? '',
    speed_rating: parsed.speed_rating ?? '',
    price: parsed.price,
    price_compare: parsed.price_compare || null,
    stock: parsed.stock,
    images: [imageUrl],
    tags: parsed.tags ? parsed.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
    is_featured: parsed.is_featured === 'on',
    is_active: parsed.is_active !== 'off'
  }
}

export async function createProductAction(formData: FormData) {
  const supabase = createAdminClient()
  if (!supabase) throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY para guardar productos.')

  const payload = await payloadFromForm(formData)
  const { error } = await supabase.from('products').insert(payload)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/catalogo')
  revalidatePath('/admin/productos')
  redirect('/admin/productos')
}

export async function updateProductAction(formData: FormData) {
  const supabase = createAdminClient()
  if (!supabase) throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY para editar productos.')

  const id = String(formData.get('id') ?? '')
  const payload = await payloadFromForm(formData)
  const { error } = await supabase.from('products').update(payload).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/catalogo')
  revalidatePath('/admin/productos')
  redirect('/admin/productos')
}

export async function deactivateProductAction(formData: FormData) {
  const supabase = createAdminClient()
  if (!supabase) throw new Error('Falta configurar Supabase para desactivar productos.')

  const id = String(formData.get('id') ?? '')
  const { error } = await supabase.from('products').update({ is_active: false }).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/catalogo')
  revalidatePath('/admin/productos')
}

export async function toggleProductActiveAction(formData: FormData) {
  const supabase = createAdminClient()
  if (!supabase) throw new Error('Falta configurar Supabase para actualizar productos.')

  const id = String(formData.get('id') ?? '')
  const isActive = String(formData.get('is_active') ?? '') === 'true'
  const { error } = await supabase.from('products').update({ is_active: isActive }).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/catalogo')
  revalidatePath('/admin/productos')
}
