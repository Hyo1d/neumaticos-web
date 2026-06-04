'use client'

import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { parseTireSize } from '@/lib/utils'

const widths = [155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265]
const ratios = [35, 40, 45, 50, 55, 60, 65, 70, 75]
const rims = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22]

export default function TireSearch() {
  const router = useRouter()
  const [width, setWidth] = useState('185')
  const [ratio, setRatio] = useState('65')
  const [rim, setRim] = useState('15')
  const [q, setQ] = useState('')

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const params = new URLSearchParams()
    const query = q.trim()

    if (query) {
      const parsed = parseTireSize(query)

      if (parsed) {
        params.set('width', String(parsed.width))
        params.set('aspectRatio', String(parsed.aspectRatio))
        params.set('rimSize', String(parsed.rimSize))
      } else {
        params.set('q', query)
      }
    } else {
      params.set('width', width)
      params.set('aspectRatio', ratio)
      params.set('rimSize', rim)
    }

    router.push(`/catalogo?${params.toString()}`)
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_20px_55px_rgba(18,22,41,0.16)]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="font-display text-3xl font-bold uppercase text-[#121629]">Busca por medida</p>
        <p className="text-sm font-semibold text-slate-500">Ejemplo: 185/65 R15</p>
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_1.4fr_auto]">
        <label className="grid gap-1 text-xs font-bold uppercase text-slate-500">
          Ancho
          <select value={width} onChange={(event) => setWidth(event.target.value)} className="h-12 rounded-md border border-slate-200 bg-slate-50 px-3 text-base font-bold text-[#121629]">
            {widths.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-slate-500">
          Alto
          <select value={ratio} onChange={(event) => setRatio(event.target.value)} className="h-12 rounded-md border border-slate-200 bg-slate-50 px-3 text-base font-bold text-[#121629]">
            {ratios.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-slate-500">
          Rodado
          <select value={rim} onChange={(event) => setRim(event.target.value)} className="h-12 rounded-md border border-slate-200 bg-slate-50 px-3 text-base font-bold text-[#121629]">
            {rims.map((value) => <option key={value}>R{value}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-bold uppercase text-slate-500">
          Texto libre
          <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Marca, modelo o 185/65 R15" className="h-12 rounded-md border border-slate-200 bg-slate-50 px-3 text-[#121629]" />
        </label>
        <button className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-rubber px-6 font-black uppercase text-white shadow-lg shadow-rubber/25">
          <Search size={18} /> Buscar
        </button>
      </div>
    </form>
  )
}
