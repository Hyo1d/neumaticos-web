'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  icon: z.string().optional()
})

export async function createCategoryAction(formData: FormData) {
  const supabase = createAdminClient()
  if (!supabase) throw new Error('Falta configurar Supabase para crear categorias.')

  const payload = schema.parse(Object.fromEntries(formData))
  const { error } = await supabase.from('categories').insert({ ...payload, is_active: true })
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/categorias')
}

export async function updateCategoryAction(formData: FormData) {
  const supabase = createAdminClient()
  if (!supabase) throw new Error('Falta configurar Supabase para editar categorias.')

  const id = String(formData.get('id') ?? '')
  const payload = schema.parse(Object.fromEntries(formData))
  const { error } = await supabase.from('categories').update({ ...payload, is_active: true }).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/categorias')
}

export async function deactivateCategoryAction(formData: FormData) {
  const supabase = createAdminClient()
  if (!supabase) throw new Error('Falta configurar Supabase para desactivar categorias.')

  const id = String(formData.get('id') ?? '')
  const { error } = await supabase.from('categories').update({ is_active: false }).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/categorias')
}
