import { notFound } from 'next/navigation'
import Link from 'next/link'
import { resolvePublicTenantContext } from '@/app/lib/tenant'
import { createClient } from '@/app/lib/supabase/server'
import { formatBusinessHours, type BusinessHourRow } from '@/app/lib/format'

type PageProps = {
  params: Promise<{ tenant: string; establishment: string }>
}

export default async function EstablishmentHome({ params }: PageProps) {
  const { tenant, establishment } = await params
  const ctx = await resolvePublicTenantContext(tenant, establishment)
  if (!ctx) notFound()

  const supabase = await createClient()
  const { data: hoursData } = await supabase
    .from('business_hours')
    .select('weekday, opens_at, closes_at')
    .eq('establishment_id', ctx.establishmentId)

  const hourLines = formatBusinessHours((hoursData ?? []) as BusinessHourRow[])

  return (
    <section className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <p
        className="text-xs font-medium uppercase tracking-widest"
        style={{ color: 'var(--brand-primary)' }}
      >
        {ctx.tenantName}
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        {ctx.establishmentName}
      </h1>
      <p className="mt-4 max-w-lg text-neutral-600">
        Reserve sua mesa em poucos segundos. Escolha data, horário e pronto.
      </p>

      <div className="mt-10">
        <Link
          href={`/${tenant}/${establishment}/reservar`}
          className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        >
          Fazer reserva
        </Link>
      </div>

      {hourLines.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xs font-medium uppercase tracking-widest text-neutral-500">
            Horário de funcionamento
          </h2>
          <ul className="mt-4 space-y-1.5 text-sm text-neutral-700">
            {hourLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
