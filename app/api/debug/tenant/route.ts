import { NextResponse } from 'next/server'
import { resolvePublicTenantContext } from '@/app/lib/tenant'

export async function GET() {
  const ctx = await resolvePublicTenantContext('nonna', 'centro')
  if (!ctx) {
    return NextResponse.json(
      { ok: false, error: 'tenant ou establishment não encontrado' },
      { status: 404 }
    )
  }
  return NextResponse.json({ ok: true, context: ctx })
}
