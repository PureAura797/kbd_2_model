"use client"

import { motion, useScroll } from "framer-motion"
import { useState, useEffect } from "react"

const NAV_ITEMS = [
  { label: "Характеристики", href: "#specs" },
  { label: "Конфигуратор", href: "#configurator" },
]

export function Header() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (v) => setScrolled(v > 40))
    return unsubscribe
  }, [scrollY])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[100]"
    >
      <div
        className={`transition-all duration-700 ${
          scrolled
            ? 'bg-white/70 backdrop-blur-2xl border-b border-black/[0.04] shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="section-container flex items-center justify-between h-[72px]">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3 shrink-0 group">
            <img
              src="/mzta.svg"
              alt="МЗТА"
              className="h-[18px] w-auto opacity-40 group-hover:opacity-80 transition-opacity duration-500"
            />
          </a>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--text-muted)]
                  hover:text-[var(--text-primary)] transition-colors duration-500"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA micro */}
          <a
            href="https://www.mzta.ru/kontakty"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center px-5 py-2 rounded-full text-[11px] uppercase tracking-[0.12em]
              border border-black/10 text-[var(--text-secondary)]
              hover:border-black/20 hover:text-[var(--text-primary)] hover:bg-black/[0.02]
              transition-all duration-500"
          >
            Связаться
          </a>
        </div>
      </div>
    </motion.header>
  )
}
