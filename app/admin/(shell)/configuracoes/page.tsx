import { resolveAdminTenantContext } from '@/app/lib/tenant'
import { redirect } from 'next/navigation'

export default async function ConfiguracoesPage() {
  const ctx = await resolveAdminTenantContext()
  if (!ctx) redirect('/admin/login')

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Preferências do tenant e do estabelecimento.
      </p>

      <div className="mt-8 space-y-2 rounded-lg border border-neutral-200 bg-white p-6 text-sm">
        <Row label="Tenant" value={ctx.tenantName} />
        <Row label="Slug" value={ctx.tenantSlug} mono />
        <Row label="Sua função" value={ctx.role} />
        <Row label="Cor de marca" value={ctx.brandColor} mono />
      </div>

      <p className="mt-6 text-xs text-neutral-400">
        Edição de configurações chega em versões futuras.
      </p>
    </section>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-100 py-2 last:border-0">
      <span className="text-neutral-500">{label}</span>
      <span className={mono ? 'font-mono text-neutral-800' : 'text-neutral-800'}>
        {value}
      </span>
    </div>
  )
}
