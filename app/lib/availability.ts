/**
 * app/lib/availability.ts
 *
 * Cálculo de slots disponíveis por estabelecimento e dia.
 * Respeita business_hours, reservations confirmadas e slot_blocks.
 *
 * Protótipo: 3 queries + cálculo em TypeScript.
 * Fase 2: mover para função PL/pgSQL para performance em escala.
 */

import { createClient, createAdminClient } from '@/app/lib/supabase/server'

export type AvailableSlot = {
  start: string
  end: string
  available: boolean
}

export async function getAvailability(
  establishmentId: string,
  dayISO: string
): Promise<AvailableSlot[]> {
  const supabase = await createClient()

  const { data: est } = await supabase
    .from('establishments')
    .select('id, timezone')
    .eq('id', establishmentId)
    .single()

  if (!est) return []

  const day = new Date(`${dayISO}T00:00:00`)
  const weekday = day.getDay()

  const { data: hours } = await supabase
    .from('business_hours')
    .select('opens_at, closes_at, slot_duration_minutes')
    .eq('establishment_id', establishmentId)
    .eq('weekday', weekday)
    .maybeSingle()

  if (!hours) return []

  const slots: AvailableSlot[] = []
  const [openH, openM] = hours.opens_at.split(':').map(Number)
  const [closeH, closeM] = hours.closes_at.split(':').map(Number)
  const duration = hours.slot_duration_minutes

  const open = new Date(day)
  open.setHours(openH, openM, 0, 0)

  const close = new Date(day)
  close.setHours(closeH, closeM, 0, 0)

  for (
    let t = new Date(open);
    t < close;
    t = new Date(t.getTime() + duration * 60_000)
  ) {
    const end = new Date(t.getTime() + duration * 60_000)
    if (end > close) break
    slots.push({
      start: t.toISOString(),
      end: end.toISOString(),
      available: true,
    })
  }

  if (slots.length === 0) return []

  const dayStart = new Date(day).toISOString()
  const dayEnd = new Date(
    new Date(day).setDate(day.getDate() + 1)
  ).toISOString()

  // RLS bloqueia anon de ler reservations/slot_blocks, mas disponibilidade
  // pública precisa saber quais slots estão ocupados. Admin client server-side
  // expõe só a coluna slot_start (não vaza dados de clientes).
  const admin = createAdminClient()

  const [reservationsRes, blocksRes] = await Promise.all([
    admin
      .from('reservations')
      .select('slot_start')
      .eq('establishment_id', establishmentId)
      .eq('status', 'confirmed')
      .gte('slot_start', dayStart)
      .lt('slot_start', dayEnd),
    admin
      .from('slot_blocks')
      .select('slot_start')
      .eq('establishment_id', establishmentId)
      .gte('slot_start', dayStart)
      .lt('slot_start', dayEnd),
  ])

  // Normaliza timestamps para epoch ms (DB retorna "+00:00", JS gera ".000Z")
  const taken = new Set<number>([
    ...(reservationsRes.data ?? []).map((r) => new Date(r.slot_start).getTime()),
    ...(blocksRes.data ?? []).map((b) => new Date(b.slot_start).getTime()),
  ])

  return slots.map((s) => ({
    ...s,
    available: !taken.has(new Date(s.start).getTime()),
  }))
}
