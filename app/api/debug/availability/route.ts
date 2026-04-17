import { NextResponse } from 'next/server'
import { resolvePublicTenantContext } from '@/app/lib/tenant'
import { getAvailability } from '@/app/lib/availability'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const tenantSlug = url.searchParams.get('tenant') ?? 'nonna'
  const establishmentSlug = url.searchParams.get('establishment') ?? 'centro'
  const date = url.searchParams.get('date') ?? new Date().toISOString().slice(0, 10)

  const ctx = await resolvePublicTenantContext(tenantSlug, establishmentSlug)
  if (!ctx) {
    return NextResponse.json(
      { ok: false, error: 'tenant ou establishment não encontrado' },
      { status: 404 }
    )
  }

  const slots = await getAvailability(ctx.establishmentId, date)

  return NextResponse.json({
    ok: true,
    tenant: ctx.tenantName,
    establishment: ctx.establishmentName,
    date,
    slotsCount: slots.length,
    slots,
  })
}
