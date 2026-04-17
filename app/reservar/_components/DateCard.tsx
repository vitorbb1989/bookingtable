'use client'

interface DateCardProps {
  label: string
  day: string
  weekday: string
  selected: boolean
  onClick: () => void
}

export function DateCard({ label, day, weekday, selected, onClick }: DateCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-[62px] py-[10px] text-center rounded-[4px] cursor-pointer transition-all duration-150 flex-shrink-0"
      style={
        selected
          ? { backgroundColor: '#F5C042', border: '1px solid #F5C042' }
          : { backgroundColor: '#161410', border: '1px solid #2D2A24' }
      }
      onMouseOver={(e) => {
        if (!selected) e.currentTarget.style.borderColor = '#3D3A34'
      }}
      onMouseOut={(e) => {
        if (!selected) e.currentTarget.style.borderColor = '#2D2A24'
      }}
    >
      <div
        className="text-[9px] uppercase tracking-[0.06em]"
        style={selected ? { color: '#0A0906', fontWeight: 700 } : { color: '#5C5549' }}
      >
        {label}
      </div>
      <div
        className="text-[19px] font-bold font-mono"
        style={{ color: selected ? '#0A0906' : '#F0E8D8' }}
      >
        {day}
      </div>
      <div
        className="text-[9px]"
        style={selected ? { color: '#0A0906', opacity: 0.7 } : { color: '#5C5549' }}
      >
        {weekday}
      </div>
    </button>
  )
}
