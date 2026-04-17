export function StatusBar() {
  return (
    <div
      className="h-[44px] flex items-center justify-between px-[26px]"
      style={{ backgroundColor: '#0A0906' }}
    >
      <span
        className="font-mono text-[13px] font-medium"
        style={{ color: '#F0E8D8' }}
      >
        9:41
      </span>
      <div
        className="w-[68px] h-[5px] rounded-full"
        style={{ backgroundColor: '#161410' }}
      />
      <span
        className="text-[11px] opacity-60"
        style={{ color: '#F0E8D8' }}
      >
        ⌥ ▲ ■
      </span>
    </div>
  )
}
