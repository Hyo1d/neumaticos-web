import TireSearch from '@/components/store/TireSearch'

export default function SearchPage() {
  return (
    <section className="container-x min-h-[520px] py-14">
      <p className="text-sm font-black uppercase text-rubber">Buscador</p>
      <h1 className="font-display text-6xl font-bold text-[#121629]">Encontra tu medida</h1>
      <p className="mt-4 max-w-2xl font-semibold text-slate-600">Ingresa ancho, perfil y rodado, o escribi una medida como 185/65 R15 para filtrar el catalogo.</p>
      <div className="mt-8 max-w-5xl"><TireSearch /></div>
    </section>
  )
}
