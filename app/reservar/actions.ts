'use server'

import { createAdminClient } from '@/app/lib/supabase/server'
import { resolvePublicTenantContext } from '@/app/lib/tenant'

const TENANT_SLUG = 'parrilla8187'
const ESTABLISHMENT_SLUG = 'boa-viagem'

interface CreateReservationInput {
  slotStartISO: string
  partySize: string
  dados: {
    nome: string
    whatsapp: string
    email?: string
    ocasiao?: string
    observacao?: string
  }
}

export async function createReservationAction(
  input: CreateReservationInput
): Promise<
  | { ok: true; codigo: string; reservationId: string }
  | { ok: false; error: string }
> {
  try {
    const ctx = await resolvePublicTenantContext(TENANT_SLUG, ESTABLISHMENT_SLUG)
    if (!ctx) return { ok: false, error: 'Estabelecimento não encontrado' }

    const slotStart = new Date(input.slotStartISO)
    if (Number.isNaN(slotStart.getTime())) {
      return { ok: false, error: 'Horário inválido' }
    }
    const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000)

    const guestContact = [
      input.dados.whatsapp,
      input.dados.email,
      input.dados.ocasiao ? `ocasião: ${input.dados.ocasiao}` : null,
      input.dados.observacao ? `obs: ${input.dados.observacao}` : null,
      `pessoas: ${input.partySize}`,
    ]
      .filter(Boolean)
      .join(' | ')

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('reservations')
      .insert({
        tenant_id: ctx.tenantId,
        establishment_id: ctx.establishmentId,
        slot_start: slotStart.toISOString(),
        slot_end: slotEnd.toISOString(),
        guest_name: input.dados.nome,
        guest_contact: guestContact,
        status: 'confirmed',
        source: 'public',
      })
      .select('id')
      .single()

    if (error) {
      if (error.code === '23505') {
        return { ok: false, error: 'Esse horário acabou de ser reservado. Escolha outro.' }
      }
      return { ok: false, error: 'Não foi possível registrar sua reserva. Tente novamente.' }
    }

    const codigo = `#P8187-${data.id.slice(0, 4).toUpperCase()}`

    return { ok: true, codigo, reservationId: data.id }
  } catch {
    return { ok: false, error: 'Erro inesperado. Tente novamente.' }
  }
}
