const WEEKDAYS_PT = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const WEEKDAYS_SHORT_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export type BusinessHourRow = {
  weekday: number
  opens_at: string
  closes_at: string
}

function formatHHMM(time: string): string {
  return time.slice(0, 5)
}

/**
 * Agrupa business_hours em faixas contínuas de weekdays com mesmo horário.
 * Ex: [2,3,4,5,6] (ter-sáb) 18:00-23:00 + [0] (dom) 18:00-23:00
 *     vira "Ter a Sáb · 18:00–23:00" + "Dom · 18:00–23:00"
 */
export function formatBusinessHours(rows: BusinessHourRow[]): string[] {
  if (rows.length === 0) return []

  const sorted = [...rows].sort((a, b) => a.weekday - b.weekday)
  const groups: { start: number; end: number; opens: string; closes: string }[] = []

  for (const row of sorted) {
    const last = groups[groups.length - 1]
    const sameHours =
      last &&
      last.opens === row.opens_at &&
      last.closes === row.closes_at &&
      last.end + 1 === row.weekday

    if (sameHours) {
      last.end = row.weekday
    } else {
      groups.push({
        start: row.weekday,
        end: row.weekday,
        opens: row.opens_at,
        closes: row.closes_at,
      })
    }
  }

  return groups.map((g) => {
    const days =
      g.start === g.end
        ? WEEKDAYS_PT[g.start]
        : `${WEEKDAYS_SHORT_PT[g.start]} a ${WEEKDAYS_SHORT_PT[g.end]}`
    return `${days} · ${formatHHMM(g.opens)}–${formatHHMM(g.closes)}`
  })
}
