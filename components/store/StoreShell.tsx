import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import { getBrands, getCategories } from '@/lib/catalog'
import { getPromoMessages } from '@/lib/site-content'

export default async function StoreShell({ children }: { children: React.ReactNode }) {
  const [brands, categories, promoMessages] = await Promise.all([getBrands(), getCategories(), getPromoMessages()])

  return (
    <div className="min-h-screen bg-[#f3f5fb] text-[#121629]">
      <Header brands={brands} categories={categories} promoMessages={promoMessages} />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
