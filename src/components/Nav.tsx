import { useState } from 'react'
import { nav } from '../data/profile'
import { useTheme } from '../theme'

export function Nav() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <header className={open ? 'nav is-open' : 'nav'}>
      <div className="nav-inner">
       <nav className="nav-links" aria-label="Primary">
          {nav.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="nav-spacer" />
        <div className="segment" role="group" aria-label="Theme">
          <button
            type="button"
            className={theme === 'obsidian' ? 'is-on' : ''}
            onClick={() => setTheme('obsidian')}
          >
            Obsidian
          </button>
          <button
            type="button"
            className={theme === 'white' ? 'is-on' : ''}
            onClick={() => setTheme('white')}
          >
            White
          </button>
        </div>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
        </button>
      </div>
    </header>
  )
}
