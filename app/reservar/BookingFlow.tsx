'use client'

import { useState } from 'react'
import { BookingScreen, type DateOption } from './_components/BookingScreen'
import HorariosScreen from './_components/HorariosScreen'
import DadosScreen, { type DadosReserva } from './_components/DadosScreen'
import ConfirmacaoScreen from './_components/ConfirmacaoScreen'
import { BetoChat } from './_components/BetoChat'
import { createReservationAction } from './actions'

type Screen = 'booking' | 'horarios' | 'dados' | 'confirmacao'

interface BookingFlowProps {
  dates: DateOption[]
}

export function BookingFlow({ dates }: BookingFlowProps) {
  const [screen, setScreen] = useState<Screen>('booking')
  const [partySize, setPartySize] = useState<string>('2')
  const [dateIndex, setDateIndex] = useState<number>(0)
  const [turno, setTurno] = useState<'almoco' | 'jantar'>('jantar')
  const [selectedSlotISO, setSelectedSlotISO] = useState<string>('')
  const [selectedSlotLabel, setSelectedSlotLabel] = useState<string>('')
  const [confirmation, setConfirmation] = useState<{
    nome: string
    codigo: string
    ocasiao?: string
  } | null>(null)
  const [resetKey, setResetKey] = useState<number>(0)

  const selectedDate = dates[dateIndex]
  const dateLabel =
    selectedDate.label === 'Hoje' || selectedDate.label === 'Amanhã'
      ? `${selectedDate.label}, ${selectedDate.day} de ${monthLabel(selectedDate.iso)}`
      : `${selectedDate.weekday}, ${selectedDate.day} de ${monthLabel(selectedDate.iso)}`

  const resetFlow = () => {
    setPartySize('2')
    setDateIndex(0)
    setTurno('jantar')
    setSelectedSlotISO('')
    setSelectedSlotLabel('')
    setConfirmation(null)
    setResetKey((k) => k + 1)
    setScreen('booking')
  }

  return (
    <>
      {screen === 'confirmacao' && confirmation ? (
        <ConfirmacaoScreen
          key={resetKey}
          nome={confirmation.nome}
          partySize={partySize}
          dateLabel={dateLabel}
          horario={selectedSlotLabel}
          codigo={confirmation.codigo}
          ocasiao={confirmation.ocasiao}
          onNovaReserva={resetFlow}
        />
      ) : screen === 'dados' ? (
        <DadosScreen
          partySize={partySize}
          dateLabel={dateLabel}
          horario={selectedSlotLabel}
          onBack={() => setScreen('horarios')}
          onConfirm={async (dados: DadosReserva) => {
            const result = await createReservationAction({
              slotStartISO: selectedSlotISO,
              partySize,
              dados,
            })
            if (result.ok) {
              setConfirmation({
                nome: dados.nome,
                codigo: result.codigo,
                ocasiao: dados.ocasiao,
              })
              setScreen('confirmacao')
            }
            return result
          }}
        />
      ) : screen === 'horarios' ? (
        <HorariosScreen
          partySize={partySize}
          dateISO={selectedDate.iso}
          dateLabel={dateLabel}
          turno={turno}
          onBack={() => setScreen('booking')}
          onConfirm={(slotStart, horarioLabel) => {
            setSelectedSlotISO(slotStart)
            setSelectedSlotLabel(horarioLabel)
            setScreen('dados')
          }}
        />
      ) : (
        <BookingScreen
          partySize={partySize}
          setPartySize={setPartySize}
          dateIndex={dateIndex}
          setDateIndex={setDateIndex}
          turno={turno}
          setTurno={setTurno}
          dates={dates}
          onContinue={() => setScreen('horarios')}
        />
      )}
      <BetoChat />
    </>
  )
}

const MESES_PT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function monthLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  return MESES_PT[d.getMonth()]
}
