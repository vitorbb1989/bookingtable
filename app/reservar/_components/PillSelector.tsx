'use client'

interface PillSelectorProps {
  label: string
  selected: boolean
  onClick: () => void
  variant?: 'quantity' | 'turno'
}

export function PillSelector({ label, selected, onClick, variant = 'quantity' }: PillSelectorProps) {
  const isQuantity = variant === 'quantity'
  const isSixPlus = label === '6+'

  const baseStyle: React.CSSProperties = isQuantity
    ? {
        width: isSixPlus ? '52px' : '40px',
        height: '40px',
        borderRadius: '4px',
        border: '1px solid rgba(255,255,255,0.09)',
        backgroundColor: '#161410',
        color: '#7A6A50',
        fontSize: '13px',
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: "'DM Mono', monospace",
        transition: 'all 150ms',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
    : {
        flex: 1,
        height: '40px',
        borderRadius: '4px',
        border: '1px solid rgba(255,255,255,0.09)',
        backgroundColor: 'transparent',
        color: '#7A6A50',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
        cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif",
        transition: 'all 150ms',
      }

  const selectedStyle: React.CSSProperties = {
    backgroundColor: '#F5C042',
    borderColor: '#F5C042',
    color: '#0A0906',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={selected ? { ...baseStyle, ...selectedStyle } : baseStyle}
    >
      {label}
    </button>
  )
}
