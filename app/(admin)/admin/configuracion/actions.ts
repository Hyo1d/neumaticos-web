'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import type { HeroSlide } from '@/lib/types'

export async function saveSiteConfigAction(formData: FormData) {
  const key = String(formData.get('key') ?? '')
  const raw = String(formData.get('value') ?? '')
  const supabase = createAdminClient()

  if (!supabase) throw new Error('Falta configurar Supabase para guardar configuracion.')

  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch {
    throw new Error('El valor debe ser JSON valido.')
  }

  const { error } = await supabase.from('site_config').upsert({ key, value })
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/configuracion')
}

function sanitizeFileName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9.-]+/g, '-').replace(/^-+|-+$/g, '')
}

async function uploadSiteAsset(file: FormDataEntryValue | null, fallback: string) {
  const supabase = createAdminClient()

  if (!supabase || !(file instanceof File) || file.size === 0) return fallback

  await supabase.storage.createBucket('site-assets', { public: true }).catch(() => null)

  const path = `hero/${Date.now()}-${sanitizeFileName(file.name || 'hero.png')}`
  const { error } = await supabase.storage.from('site-assets').upload(path, file, { upsert: false })
  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from('site-assets').getPublicUrl(path)
  return data.publicUrl
}

async function saveConfigValue(key: string, value: unknown) {
  const supabase = createAdminClient()

  if (!supabase) throw new Error('Falta configurar Supabase para guardar configuracion.')

  const { error } = await supabase.from('site_config').upsert({ key, value })
  if (error) throw new Error(error.message)
}

export async function savePromoMessagesAction(formData: FormData) {
  const messages = Array.from({ length: 8 }, (_, index) => String(formData.get(`message_${index}`) ?? '').trim()).filter(Boolean)

  if (messages.length === 0) {
    throw new Error('Carga al menos un mensaje promocional.')
  }

  await saveConfigValue('promo_messages', messages)

  revalidatePath('/')
  revalidatePath('/admin/configuracion')
}

export async function saveHeroSlidesAction(formData: FormData) {
  const slides: HeroSlide[] = []

  for (let index = 0; index < 4; index += 1) {
    const title = String(formData.get(`slide_${index}_title`) ?? '').trim()
    const eyebrow = String(formData.get(`slide_${index}_eyebrow`) ?? '').trim()
    const text = String(formData.get(`slide_${index}_text`) ?? '').trim()
    const cta = String(formData.get(`slide_${index}_cta`) ?? '').trim()
    const href = String(formData.get(`slide_${index}_href`) ?? '').trim()
    const image = String(formData.get(`slide_${index}_image`) ?? '').trim()
    const imageAlt = String(formData.get(`slide_${index}_image_alt`) ?? '').trim()

    if (!title && !eyebrow && !text) continue

    if (!title || !text || !cta || !href) {
      throw new Error(`Completa titulo, texto, boton y enlace del slide ${index + 1}.`)
    }

    slides.push({
      eyebrow,
      title,
      text,
      cta,
      href,
      image: await uploadSiteAsset(formData.get(`slide_${index}_image_file`), image || '/fantini-hero-showroom.png'),
      imageAlt: imageAlt || title
    })
  }

  if (slides.length === 0) {
    throw new Error('Carga al menos un slide del hero.')
  }

  await saveConfigValue('hero_slides', slides)

  revalidatePath('/')
  revalidatePath('/admin/configuracion')
}

export async function updateFeaturedProductsAction(formData: FormData) {
  const supabase = createAdminClient()
  if (!supabase) throw new Error('Falta configurar Supabase para guardar destacados.')

  const productIds = formData.getAll('product_id').map(String)

  if (productIds.length > 8) {
    throw new Error('Solo se pueden seleccionar hasta 8 productos destacados.')
  }

  const { error: clearError } = await supabase.from('products').update({ is_featured: false }).eq('is_active', true)
  if (clearError) throw new Error(clearError.message)

  if (productIds.length > 0) {
    const { error: updateError } = await supabase.from('products').update({ is_featured: true }).in('id', productIds)
    if (updateError) throw new Error(updateError.message)
  }

  revalidatePath('/')
  revalidatePath('/catalogo')
  revalidatePath('/admin/configuracion')
  revalidatePath('/admin/productos')
}
