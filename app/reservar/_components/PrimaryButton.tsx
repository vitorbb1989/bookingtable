'use client'

interface PrimaryButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
}

export function PrimaryButton({ children, onClick, disabled = false }: PrimaryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: '#F5C042',
        color: '#0A0906',
        width: '100%',
        height: '52px',
        borderRadius: '4px',
        border: 'none',
        fontSize: '13px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: "'DM Sans', sans-serif",
        opacity: disabled ? 0.3 : 1,
        transition: 'opacity 150ms ease',
      }}
      onMouseOver={(e) => {
        if (!disabled) e.currentTarget.style.opacity = '0.88'
      }}
      onMouseOut={(e) => {
        if (!disabled) e.currentTarget.style.opacity = '1'
      }}
    >
      {children}
    </button>
  )
}
