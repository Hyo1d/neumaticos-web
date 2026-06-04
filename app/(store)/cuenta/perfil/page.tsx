import { redirect } from 'next/navigation'
import ProfileForm from '@/components/store/ProfileForm'
import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/cuenta/login')

  const metadata = user.user_metadata ?? {}

  return (
    <section className="container-x min-h-[520px] py-8 sm:py-14">
      <ProfileForm
        email={user.email ?? ''}
        initialProfile={{
          name: String(metadata.name ?? ''),
          phone: String(metadata.phone ?? ''),
          document: String(metadata.document ?? ''),
          address: String(metadata.address ?? ''),
          city: String(metadata.city ?? ''),
          province: String(metadata.province ?? ''),
          postal_code: String(metadata.postal_code ?? '')
        }}
      />
    </section>
  )
}
