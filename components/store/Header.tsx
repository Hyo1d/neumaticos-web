'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Menu, Search, ShoppingCart, User, X } from 'lucide-react'
import CartDrawer from '@/components/store/CartDrawer'
import WhatsAppIcon from '@/components/store/WhatsAppIcon'
import { site } from '@/lib/site'
import { useCartStore } from '@/lib/store'
import type { Brand, Category } from '@/lib/types'
import { useState } from 'react'

export default function Header({ brands, categories, promoMessages }: { brands: Brand[]; categories: Category[]; promoMessages: string[] }) {
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const count = useCartStore((state) => state.itemCount())

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-[0_8px_30px_rgba(18,22,41,0.08)]">
        <div className="bg-rubber py-2 text-xs font-extrabold uppercase text-white">
          <div className="marquee-mask">
            <div className="promo-marquee">
              {promoMessages.concat(promoMessages, promoMessages).map((message, index) => <span key={`${message}-${index}`}>{message}</span>)}
            </div>
          </div>
        </div>

        <div className="container-x grid min-h-16 grid-cols-[auto_auto] items-center justify-between gap-2 py-2 md:min-h-20 md:grid-cols-[auto_1fr_auto] md:gap-4 md:py-3">
          <Link href="/" className="flex items-center" aria-label={site.name}>
            <Image src={site.logoUrl} alt={site.name} width={148} height={64} className="h-11 w-auto rounded-md object-contain shadow-sm md:h-14" priority />
          </Link>

          <form action="/catalogo" className="hidden h-12 overflow-hidden rounded-md border border-slate-200 bg-slate-50 md:grid md:grid-cols-[1fr_auto]">
            <input name="q" className="min-w-0 bg-transparent px-4 text-sm outline-none" placeholder="Buscar por medida, marca o modelo" />
            <button className="flex w-14 items-center justify-center bg-rubber text-white" aria-label="Buscar">
              <Search size={20} />
            </button>
          </form>

          <div className="flex items-center gap-1.5 md:gap-2">
            <a href={site.whatsappHref} target="_blank" className="inline-flex items-center gap-2 rounded-md bg-whatsapp p-2.5 text-sm font-black uppercase text-white shadow-lg shadow-whatsapp/25 transition hover:bg-whatsappDark sm:px-4 sm:py-3" rel="noreferrer" aria-label="WhatsApp">
              <WhatsAppIcon className="h-5 w-5" /> <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <Link href="/cuenta/login" className="rounded-md border border-slate-200 p-2.5 text-slate-700 sm:p-3" aria-label="Cuenta">
              <User size={20} />
            </Link>
            <button onClick={() => setOpen(true)} className="relative rounded-md bg-rubber p-2.5 text-white sm:p-3" aria-label="Abrir carrito">
              <ShoppingCart size={20} />
              {count > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-[#ffc400] px-2 text-xs font-black text-[#121629]">{count}</span>}
            </button>
            <button onClick={() => setMenuOpen(true)} className="rounded-md border border-slate-200 p-2.5 text-slate-700 md:hidden" aria-label="Menu">
              <Menu size={20} />
            </button>
          </div>
        </div>

        <form action="/catalogo" className="container-x mb-3 grid h-11 grid-cols-[1fr_auto] overflow-hidden rounded-md border border-slate-200 bg-slate-50 md:hidden">
          <input name="q" className="min-w-0 bg-transparent px-3 text-sm outline-none" placeholder="Buscar medida o marca" />
          <button className="flex w-12 items-center justify-center bg-rubber text-white" aria-label="Buscar">
            <Search size={18} />
          </button>
        </form>

        <div className="hidden border-t border-slate-200 bg-[#151111] text-white md:block">
          <div className="container-x flex min-h-12 flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-black uppercase md:justify-between">
            <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
              <div className="mega-menu">
                <button className="mega-trigger" type="button">Neumaticos <ChevronDown size={14} /></button>
                <div className="mega-panel">
                  <div className="container-x grid gap-x-12 gap-y-3 py-5 sm:grid-cols-3 lg:grid-cols-5">
                    {categories.map((category) => (
                      <Link key={category.id} href={`/categorias/${category.slug}`} className="mega-link">{category.name}</Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mega-menu">
                <button className="mega-trigger" type="button">Marcas <ChevronDown size={14} /></button>
                <div className="mega-panel">
                  <div className="container-x grid gap-x-12 gap-y-3 py-5 sm:grid-cols-3 lg:grid-cols-5">
                    {brands.map((brand) => (
                      <Link key={brand.id} href={`/marcas/${brand.slug}`} className="mega-link">{brand.name}</Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link href="/catalogo?q=llantas">Accesorios</Link>
              <Link href="/catalogo">Outlet</Link>
              <Link href="/nosotros">Sucursales</Link>
              <Link href="/buscar">Centro de ayuda</Link>
              <Link href="/nosotros">Quienes somos</Link>
            </nav>
          </div>
        </div>
      </header>
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-[#121629]/60 md:hidden" onClick={() => setMenuOpen(false)}>
          <aside className="ml-auto flex h-full w-full max-w-sm flex-col bg-white text-[#121629] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <Image src={site.logoUrl} alt={site.name} width={126} height={54} className="h-11 w-auto object-contain" />
              <button onClick={() => setMenuOpen(false)} className="rounded-md border border-slate-200 p-2 text-slate-600" aria-label="Cerrar menu">
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 overflow-auto p-4">
              <p className="text-xs font-black uppercase text-rubber">Comprar</p>
              <div className="mt-2 grid gap-2">
                <Link onClick={() => setMenuOpen(false)} href="/catalogo" className="rounded-md border border-slate-200 px-3 py-3 font-black">Catalogo completo</Link>
                <Link onClick={() => setMenuOpen(false)} href="/catalogo?q=llantas" className="rounded-md border border-slate-200 px-3 py-3 font-black">Accesorios</Link>
                <Link onClick={() => setMenuOpen(false)} href="/buscar" className="rounded-md border border-slate-200 px-3 py-3 font-black">Centro de ayuda</Link>
                <Link onClick={() => setMenuOpen(false)} href="/nosotros" className="rounded-md border border-slate-200 px-3 py-3 font-black">Sucursales</Link>
              </div>

              <p className="mt-6 text-xs font-black uppercase text-rubber">Categorias</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link key={category.id} onClick={() => setMenuOpen(false)} href={`/categorias/${category.slug}`} className="rounded-md bg-slate-50 px-3 py-3 text-sm font-black">{category.name}</Link>
                ))}
              </div>

              <p className="mt-6 text-xs font-black uppercase text-rubber">Marcas</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {brands.slice(0, 12).map((brand) => (
                  <Link key={brand.id} onClick={() => setMenuOpen(false)} href={`/marcas/${brand.slug}`} className="rounded-md bg-slate-50 px-3 py-3 text-sm font-black">{brand.name}</Link>
                ))}
              </div>
            </nav>

            <div className="border-t border-slate-200 p-4">
              <a href={site.whatsappHref} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-md bg-whatsapp px-4 py-3 text-sm font-black uppercase text-white">
                <WhatsAppIcon className="h-5 w-5" />
                Consultar por WhatsApp
              </a>
            </div>
          </aside>
        </div>
      )}
      <CartDrawer open={open} onOpenChange={setOpen} />
    </>
  )
}
