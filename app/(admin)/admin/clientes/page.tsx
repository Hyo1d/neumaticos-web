import { getAdminCustomers } from '@/lib/admin-data'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers()

  return (
    <>
      <p className="text-sm font-black uppercase text-rubber">Base de clientes</p>
      <h1 className="font-display text-6xl font-bold text-[#121629]">Clientes</h1>
      <div className="mt-8 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-slate-50 text-left text-xs font-black uppercase text-slate-500">
            <tr><th className="p-3">Cliente</th><th>Email</th><th>Telefono</th><th>Tipo</th><th>Pedidos</th><th>Total comprado</th></tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-slate-100 text-slate-700">
                <td className="p-3 font-black text-[#121629]">{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.type}</td>
                <td>{customer.orders}</td>
                <td className="font-black text-[#121629]">{formatPrice(customer.totalSpent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
