import { AlertTriangle, Banknote, Package, ShoppingBag, Users } from 'lucide-react'
import { getAdminStats } from '@/lib/admin-data'
import { formatPrice } from '@/lib/utils'

export default async function StatsCards() {
  const stats = await getAdminStats()
  const cards = [
    { label: 'Pedidos hoy', value: String(stats.todayOrders), icon: ShoppingBag },
    { label: 'Ingresos del mes', value: formatPrice(stats.monthlyRevenue), icon: Banknote },
    { label: 'Productos activos', value: String(stats.activeProducts), icon: Package },
    { label: 'Stock bajo', value: String(stats.lowStock), icon: AlertTriangle },
    { label: 'Clientes', value: String(stats.customers), icon: Users }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((stat) => {
        const Icon = stat.icon

        return (
          <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <Icon className="text-rubber" />
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-black text-slate-500">Live</span>
            </div>
            <p className="mt-4 text-sm font-bold text-slate-500">{stat.label}</p>
            <p className="font-display text-4xl font-bold text-[#121629]">{stat.value}</p>
          </div>
        )
      })}
    </div>
  )
}
