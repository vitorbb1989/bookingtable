import { resolveAdminTenantContext } from '@/app/lib/tenant'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const ctx = await resolveAdminTenantContext()
  if (!ctx) redirect('/admin/login')

  return (
    <section className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Bem-vindo de volta ao painel de {ctx.tenantName}.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card label="Reservas hoje" value="—" hint="Disponível no Cycle 2" />
        <Card label="Próximos 7 dias" value="—" hint="Disponível no Cycle 2" />
        <Card label="Ocupação média" value="—" hint="Disponível no Cycle 2" />
      </div>
    </section>
  )
}

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      {hint && <p className="mt-2 text-xs text-neutral-400">{hint}</p>}
    </div>
  )
}
