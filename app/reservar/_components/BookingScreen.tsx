'use client'

import { PillSelector } from './PillSelector'
import { DateCard } from './DateCard'
import { PrimaryButton } from './PrimaryButton'
import { StatusBar } from './StatusBar'

export interface DateOption {
  label: string // "Hoje" | "Amanhã" | short month like "Abr"
  day: string // "17"
  weekday: string // "Qui"
  iso: string // YYYY-MM-DD
}

interface BookingScreenProps {
  partySize: string
  setPartySize: (v: string) => void
  dateIndex: number
  setDateIndex: (v: number) => void
  turno: 'almoco' | 'jantar'
  setTurno: (v: 'almoco' | 'jantar') => void
  dates: DateOption[]
  onContinue: () => void
}

const partySizes = ['1', '2', '3', '4', '5', '6+']

export function BookingScreen({
  partySize,
  setPartySize,
  dateIndex,
  setDateIndex,
  turno,
  setTurno,
  dates,
  onContinue,
}: BookingScreenProps) {
  return (
    <div className="min-h-screen max-w-[375px] mx-auto" style={{ backgroundColor: '#0A0906' }}>
      <StatusBar />

      <div className="pt-[20px] pb-0 px-[22px]">
        <div className="flex items-center gap-[12px] mb-[20px]">
          <div
            className="w-[52px] h-[52px] rounded-full flex-shrink-0 flex items-center justify-center"
            style={{ backgroundColor: '#0A0906', border: '2px solid #F5C042' }}
          >
            <div className="text-center leading-tight">
              <div className="text-[7px] font-bold uppercase tracking-[0.08em]" style={{ color: '#F5C042' }}>
                PARRILLA
              </div>
              <div className="text-[10px] font-bold tracking-[0.02em]" style={{ color: '#F5C042' }}>
                8187
              </div>
              <div className="text-[6px] opacity-70 tracking-[0.06em] uppercase" style={{ color: '#F5C042' }}>
                ★ ★ ★
              </div>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-[2px]" style={{ color: '#5C5549' }}>
              Bar e Churrascaria
            </div>
            <div
              className="text-[22px] font-bold tracking-[-0.01em] leading-tight font-sans"
              style={{ color: '#F0E8D8' }}
            >
              Parrilla 8187
            </div>
            <div className="text-[12px] mt-[2px]" style={{ color: '#9B9385' }}>
              Boa Viagem, Recife
            </div>
          </div>
        </div>

        <div className="flex items-center gap-[10px] mb-[22px]">
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
          <span className="text-[12px]" style={{ color: '#C45C26' }}>◆</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
        </div>
      </div>

      <div className="px-[22px]">
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-[10px]" style={{ color: '#5C5549' }}>
          Quantas pessoas?
        </div>
        <div className="flex flex-wrap gap-[7px] mb-[22px]">
          {partySizes.map((size) => (
            <PillSelector
              key={size}
              label={size}
              selected={partySize === size}
              onClick={() => setPartySize(size)}
            />
          ))}
        </div>
      </div>

      <div className="px-[22px]">
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-[10px]" style={{ color: '#5C5549' }}>
          Quando?
        </div>
        <div
          className="flex gap-[7px] overflow-x-auto pb-[4px] mb-[22px]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {dates.map((date, index) => (
            <DateCard
              key={date.iso}
              label={date.label}
              day={date.day}
              weekday={date.weekday}
              selected={dateIndex === index}
              onClick={() => setDateIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className="px-[22px]">
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-[10px]" style={{ color: '#5C5549' }}>
          Turno
        </div>
        <div className="flex gap-[8px] mb-[28px]">
          <PillSelector label="Almoço" selected={turno === 'almoco'} onClick={() => setTurno('almoco')} variant="turno" />
          <PillSelector label="Jantar" selected={turno === 'jantar'} onClick={() => setTurno('jantar')} variant="turno" />
        </div>
      </div>

      <div className="px-[22px] mb-[20px]">
        <div
          className="inline-flex items-center justify-center gap-[6px] w-full rounded-[4px] px-[10px] py-[10px]"
          style={{ backgroundColor: '#161410', border: '1px solid rgba(245,192,66,0.25)' }}
        >
          <span className="text-[12px]" style={{ color: '#C45C26' }}>●</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.06em]" style={{ color: '#F5C042' }}>
            A melhor picanha da cidade
          </span>
        </div>
      </div>

      <div className="px-[22px] pb-10">
        <PrimaryButton onClick={onContinue}>Ver horários disponíveis</PrimaryButton>
      </div>
    </div>
  )
}
