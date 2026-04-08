import type { Metadata } from 'next'
import { Jura, Unbounded, JetBrains_Mono, Geist } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jura = Jura({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const unbounded = Unbounded({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KB.D-2 — Дисплейный модуль ПАК «Комега» | МЗТА',
  description: 'Высокоинтегрированный дисплейный модуль для управления технологическими процессами. ARM Cortex-A7, 528 MHz, CODESYS V3.5, Ethernet, SCADA. Россия, АО МЗТА.',
  keywords: ['KB.D-2', 'контроллер', 'МЗТА', 'Комега', 'ПАК', 'SCADA', 'CODESYS', 'автоматизация', 'промышленный контроллер', 'дисплейный модуль'],
  openGraph: {
    title: 'KB.D-2 — Промышленный интеллект нового поколения',
    description: 'Дисплейный программируемый контроллер для управления технологическими процессами любой сложности.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'МЗТА — Московский завод тепловой автоматики',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={cn("scroll-smooth", "font-sans", geist.variable)}>
      <head>
        <meta name="theme-color" content="#F8F8F7" />
      </head>
      <body
        className={`${jura.variable} ${unbounded.variable} ${jetbrainsMono.variable} antialiased`}
        style={{ fontFamily: 'var(--font-body), sans-serif' }}
      >
        {children}
      </body>
    </html>
  )
}
