import { unstable_noStore as noStore } from 'next/cache'
import { getBrands, getCategories, getProducts } from '@/lib/catalog'
import { createAdminClient } from '@/lib/supabase/admin'

export type AdminOrder = {
  id: string
  customerId?: string
  userId?: string
  customer: string
  customerEmail: string
  customerPhone?: string
  status: string
  payment: string
  paymentStatus: string
  total: number
  createdAt: string
  items: string[]
  delivery: string
}

export type AdminCustomer = {
  id: string
  name: string
  email: string
  phone: string
  orders: number
  totalSpent: number
  type: string
}

export const orderStatusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  processing: 'En preparacion',
  ready: 'Listo para retirar',
  delivered: 'Entregado',
  cancelled: 'Cancelado'
}

export const paymentStatusLabels: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  rejected: 'Rechazado'
}

export const shippingMethodLabels: Record<string, string> = {
  retiro_sucursal: 'Retiro en sucursal',
  envio: 'Envio a domicilio'
}

export const paymentMethodLabels: Record<string, string> = {
  transferencia: 'Transferencia bancaria',
  tarjetas: 'Tarjetas'
}

function canReadSupabase() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  noStore()
  if (!canReadSupabase()) return []
  const supabase = createAdminClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('orders')
    .select('id, user_id, order_number, customer_name, customer_email, customer_phone, shipping_method, payment_method, payment_status, total, status, created_at, order_items(quantity, product_snapshot)')
    .order('created_at', { ascending: false })

  if (error) {
    if (error.message.includes('Could not find the table')) return []
    throw new Error(error.message)
  }

  return (data ?? []).map((order: any) => ({
    id: order.order_number,
    customerId: order.id,
    userId: order.user_id ?? undefined,
    customer: order.customer_name,
    customerEmail: order.customer_email,
    customerPhone: order.customer_phone ?? '',
    status: order.status,
    payment: order.payment_method ?? 'Sin definir',
    paymentStatus: order.payment_status ?? 'Pendiente',
    total: Number(order.total ?? 0),
    createdAt: String(order.created_at ?? '').slice(0, 10),
    delivery: order.shipping_method ?? 'Retiro en sucursal',
    items: (order.order_items ?? []).map((item: any) => `${item.product_snapshot?.name ?? 'Producto'} x${item.quantity}`)
  }))
}

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  noStore()
  const orders = await getAdminOrders()
  const byEmail = new Map<string, AdminCustomer>()

  for (const order of orders) {
    const current = byEmail.get(order.customerEmail)
    if (current) {
      current.orders += 1
      current.totalSpent += order.total
      if (order.userId) current.type = 'Registrado'
    } else {
      byEmail.set(order.customerEmail, {
        id: order.userId ?? order.customerEmail,
        name: order.customer,
        email: order.customerEmail,
        phone: order.customerPhone ?? '',
        orders: 1,
        totalSpent: order.total,
        type: order.userId ? 'Registrado' : 'Invitado'
      })
    }
  }

  const supabase = createAdminClient()
  if (supabase) {
    const { data } = await supabase.auth.admin.listUsers()
    for (const user of data?.users ?? []) {
      const email = user.email
      if (!email || byEmail.has(email)) continue
      byEmail.set(email, {
        id: user.id,
        name: String(user.user_metadata?.name ?? email),
        email,
        phone: String(user.phone ?? ''),
        orders: 0,
        totalSpent: 0,
        type: user.app_metadata?.role === 'admin' ? 'Admin' : 'Registrado'
      })
    }
  }

  return Array.from(byEmail.values())
}

export async function getAdminStats() {
  noStore()
  const [brands, categories, products, orders, customers] = await Promise.all([getBrands(), getCategories(), getProducts(), getAdminOrders(), getAdminCustomers()])
  const today = new Date().toISOString().slice(0, 10)
  const monthlyRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const outOfStock = products.filter((product) => product.stock <= 0).length
  const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 5).length

  return {
    todayOrders: orders.filter((order) => order.createdAt === today).length,
    monthlyRevenue,
    activeProducts: products.length,
    lowStock,
    outOfStock,
    customers: customers.length,
    brands: brands.length,
    categories: categories.length
  }
}

export async function getOrderById(id: string) {
  const orders = await getAdminOrders()
  return orders.find((order) => order.id === id)
}

export async function getOrderByNumber(orderNumber: string) {
  return getOrderById(orderNumber)
}
