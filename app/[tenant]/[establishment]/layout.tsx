import { notFound } from 'next/navigation'
import type { CSSProperties } from 'react'
import { resolvePublicTenantContext } from '@/app/lib/tenant'

type TenantLayoutProps = {
  children: React.ReactNode
  params: Promise<{ tenant: string; establishment: string }>
}

export default async function TenantLayout({ children, params }: TenantLayoutProps) {
  const { tenant, establishment } = await params
  const ctx = await resolvePublicTenantContext(tenant, establishment)
  if (!ctx) notFound()

  const brandStyle = {
    '--brand-primary': ctx.brandColor,
    '--brand-primary-contrast': '#ffffff',
  } as CSSProperties

  return (
    <div style={brandStyle} className="min-h-screen bg-white text-neutral-900">
      <header className="border-b border-neutral-200 px-6 py-4 flex items-center gap-3">
        {ctx.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ctx.logoUrl} alt={ctx.tenantName} className="h-8" />
        ) : (
          <div
            className="h-8 w-8 rounded"
            style={{ backgroundColor: 'var(--brand-primary)' }}
          />
        )}
        <span className="font-medium">{ctx.tenantName}</span>
      </header>
      <main>{children}</main>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ tenant: string; establishment: string }> }) {
  const { tenant, establishment } = await params
  const ctx = await resolvePublicTenantContext(tenant, establishment)
  if (!ctx) return { title: 'Reserva' }
  return { title: `${ctx.establishmentName} — Reservas` }
}
