import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-slate-100 text-[#121629] lg:grid-cols-[272px_1fr]">
      <AdminSidebar />
      <main className="min-h-screen p-5 lg:p-8">{children}</main>
    </div>
  )
}
