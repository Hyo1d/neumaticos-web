'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const schema = z.object({
  orderNumber: z.string().min(1),
  status: z.string().min(1),
  payment_status: z.string().min(1)
})

export async function updateOrderStatusAction(formData: FormData) {
  const supabase = createAdminClient()
  if (!supabase) throw new Error('Falta configurar Supabase para actualizar pedidos.')

  const payload = schema.parse(Object.fromEntries(formData))
  const { error } = await supabase
    .from('orders')
    .update({ status: payload.status, payment_status: payload.payment_status })
    .eq('order_number', payload.orderNumber)

  if (error && !error.message.includes('Could not find the table')) throw new Error(error.message)

  revalidatePath('/admin')
  revalidatePath('/admin/pedidos')
  revalidatePath(`/admin/pedidos/${payload.orderNumber}`)
}
