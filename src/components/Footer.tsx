"use client"

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04]">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1 */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)] mb-5">Продукт</p>
            <ul className="space-y-2.5">
              {["KB.D-2", "KB.D-2-CDS", "Модули расширения", "SuperSCADA"].map((item) => (
                <li key={item}>
                  <a href="https://www.mzta.ru/kb-d" target="_blank" rel="noopener noreferrer"
                    className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors duration-300"
                  >{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)] mb-5">Разработка</p>
            <ul className="space-y-2.5">
              {["kStudio", "CODESYS V3.5", "Документация", "Загрузки"].map((item) => (
                <li key={item}>
                  <a href="https://www.mzta.ru/podderzhka" target="_blank" rel="noopener noreferrer"
                    className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors duration-300"
                  >{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)] mb-5">Компания</p>
            <ul className="space-y-2.5">
              {["О МЗТА", "Производство", "Сертификация", "Карьера"].map((item) => (
                <li key={item}>
                  <a href="https://www.mzta.ru" target="_blank" rel="noopener noreferrer"
                    className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors duration-300"
                  >{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)] mb-5">Контакт</p>
            <ul className="space-y-2.5">
              <li><a href="tel:+74957205444" className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors duration-300">+7 (495) 720-54-44</a></li>
              <li><a href="tel:88005556184" className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors duration-300">8-800-555-61-84</a></li>
              <li><a href="mailto:sales@mzta.ru" className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors duration-300">sales@mzta.ru</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/mzta.svg"
              alt="МЗТА"
              className="h-4 w-auto opacity-30"
              style={{ filter: 'invert(1)' }}
            />
            <span className="font-mono text-[10px] text-[var(--text-dim)] tracking-[0.1em]">
              © {new Date().getFullYear()} МЗТА
            </span>
          </div>
          <p className="font-mono text-[10px] text-[var(--text-dim)] tracking-[0.1em]">
            105318, Москва, ул. Мироновская, д. 33, стр. 26
          </p>
        </div>
      </div>
    </footer>
  )
}
