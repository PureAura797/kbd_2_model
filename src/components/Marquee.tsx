"use client"

const ITEMS = [
  "МЗТА", "КОМЕГА", "ARM® CORTEX-A7", "CODESYS V3.5", "SCADA",
  "MODBUS TCP", "ETHERNET 10/100", "IP20", "256 МБ RAM", "kSTUDIO",
  "528 MHz", "MASTER DEVICE", "DIN RAIL", "32 МОДУЛЯ", "MICROSD",
]

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const content = ITEMS.map((item, i) => (
    <span key={i} className="flex items-center gap-[clamp(1.5rem,3vw,3rem)] whitespace-nowrap">
      <span>{item}</span>
      <span className="text-white/10 text-[0.6em]">●</span>
    </span>
  ))

  return (
    <div className="flex overflow-hidden select-none">
      <div
        className="flex items-center gap-[clamp(1.5rem,3vw,3rem)] shrink-0"
        style={{
          animation: `${reverse ? 'marquee-right' : 'marquee-left'} 60s linear infinite`,
        }}
      >
        {content}
        {content}
      </div>
    </div>
  )
}

export function Marquee() {
  return (
    <section
      className="relative py-[var(--space-8)] overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="font-display font-bold uppercase"
        style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', opacity: 0.05 }}
      >
        <MarqueeRow />
        <div className="h-[var(--space-3)]" />
        <MarqueeRow reverse />
      </div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--bg)] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--bg)] to-transparent pointer-events-none z-10" />
    </section>
  )
}
