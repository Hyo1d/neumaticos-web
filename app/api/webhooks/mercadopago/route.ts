import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const payload = await request.json()

  return NextResponse.json({
    ok: true,
    message: 'MercadoPago webhook received. Connect Supabase update logic here.',
    payload
  })
}
