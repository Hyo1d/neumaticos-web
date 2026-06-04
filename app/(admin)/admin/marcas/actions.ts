'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  logo_url: z.string().optional()
})

export async function createBrandAction(formData: FormData) {
  const supabase = createAdminClient()
  if (!supabase) throw new Error('Falta configurar Supabase para crear marcas.')

  const payload = schema.parse(Object.fromEntries(formData))
  const { error } = await supabase.from('brands').insert({ ...payload, is_active: true })
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/marcas')
}

export async function updateBrandAction(formData: FormData) {
  const supabase = createAdminClient()
  if (!supabase) throw new Error('Falta configurar Supabase para editar marcas.')

  const id = String(formData.get('id') ?? '')
  const payload = schema.parse(Object.fromEntries(formData))
  const { error } = await supabase.from('brands').update({ ...payload, is_active: true }).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/marcas')
}

export async function deactivateBrandAction(formData: FormData) {
  const supabase = createAdminClient()
  if (!supabase) throw new Error('Falta configurar Supabase para desactivar marcas.')

  const id = String(formData.get('id') ?? '')
  const { error } = await supabase.from('brands').update({ is_active: false }).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/marcas')
}
