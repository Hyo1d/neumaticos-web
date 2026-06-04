import Image from 'next/image'
import Link from 'next/link'
import { Boxes, ChartNoAxesColumn, FolderTree, Settings, ShoppingBag, Tags, Users } from 'lucide-react'
import LogoutButton from '@/components/admin/LogoutButton'
import { site } from '@/lib/site'

const items = [
  { href: '/admin', label: 'Dashboard', icon: ChartNoAxesColumn },
  { href: '/admin/productos', label: 'Productos y stock', icon: Boxes },
  { href: '/admin/categorias', label: 'Categorias', icon: FolderTree },
  { href: '/admin/marcas', label: 'Marcas', icon: Tags },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/descuentos', label: 'Descuentos', icon: Tags },
  { href: '/admin/configuracion', label: 'Configuracion', icon: Settings }
]

export default function AdminSidebar() {
  return (
    <aside className="border-r border-slate-200 bg-white p-4 lg:min-h-screen">
      <Link href="/" className="block rounded-lg border border-slate-200 bg-slate-50 p-3" aria-label={site.name}>
        <Image src={site.logoUrl} alt={site.name} width={136} height={58} className="h-14 w-auto object-contain" />
        <p className="mt-2 text-xs font-black uppercase text-slate-500">Panel administrativo</p>
      </Link>

      <nav className="mt-8 grid gap-2">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold text-slate-600 hover:bg-rubber hover:text-white">
              <Icon size={18} /> {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-black text-[#121629]">Gestion centralizada</p>
        <p className="mt-1">Categorias y marcas alimentan tienda, navbar y filtros.</p>
        <LogoutButton />
      </div>
    </aside>
  )
}
