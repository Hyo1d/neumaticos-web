import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { getProducts } from '@/lib/catalog'

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
    address: z.string().optional()
  }),
  shipping: z.string(),
  payment: z.string(),
  shippingCost: z.number(),
  total: z.number(),
  items: z.array(z.object({
    productId: z.string(),
    slug: z.string(),
    name: z.string(),
    brand: z.string(),
    image: z.string(),
    price: z.number(),
    quantity: z.number().int().positive()
  })).min(1)
})

function createOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase()
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `GOM-${timestamp}-${suffix}`
}

function isMissingTableError(error: { message?: string; code?: string }) {
  return error.code === 'PGRST205' || error.message?.includes('Could not find the table')
}

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos de checkout invalidos' }, { status: 400 })
  }

  const body = parsed.data
  const products = await getProducts()

  for (const item of body.items) {
    const product = products.find((entry) => entry.id === item.productId)
    if (!product) return NextResponse.json({ error: `Producto no encontrado: ${item.name}` }, { status: 400 })
    if (product.stock < item.quantity) return NextResponse.json({ error: `Stock insuficiente para ${product.name}` }, { status: 400 })
  }

  const orderNumber = createOrderNumber()
  const supabase = createAdminClient()
  const authClient = createServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!supabase) {
    return NextResponse.json({ orderNumber, status: 'pending', persisted: false })
  }

  const subtotal = body.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user?.id ?? null,
      customer_name: body.customer.name,
      customer_email: body.customer.email,
      customer_phone: body.customer.phone,
      shipping_method: body.shipping,
      shipping_address: { address: body.customer.address ?? '' },
      payment_method: body.payment,
      payment_status: 'pending',
      subtotal,
      shipping_cost: body.shippingCost,
      discount: 0,
      total: body.total,
      status: 'pending'
    })
    .select('id')
    .single()

  if (orderError) {
    if (isMissingTableError(orderError)) return NextResponse.json({ orderNumber, status: 'pending', persisted: false })
    return NextResponse.json({ error: orderError.message }, { status: 500 })
  }

  const orderItems = body.items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId)

    return {
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.price,
      product_snapshot: product ?? item
    }
  })

  const { error: itemError } = await supabase.from('order_items').insert(orderItems)
  if (itemError) {
    if (isMissingTableError(itemError)) return NextResponse.json({ orderNumber, status: 'pending', persisted: false })
    return NextResponse.json({ error: itemError.message }, { status: 500 })
  }

  for (const item of body.items) {
    const product = products.find((entry) => entry.id === item.productId)
    if (!product) continue
    await supabase.from('products').update({ stock: product.stock - item.quantity }).eq('id', item.productId)
  }

  return NextResponse.json({ orderNumber, status: 'pending', persisted: true })
}
