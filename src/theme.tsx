import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ThemeName } from './data/profile'

type ThemeContextValue = {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredTheme(): ThemeName {
  try {
    const stored = localStorage.getItem('el-theme')
    if (stored === 'obsidian' || stored === 'white') return stored
  } catch {
    /* private mode */
  }
  return 'obsidian'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(readStoredTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('el-theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const setTheme = useCallback((next: ThemeName) => {
    setThemeState(next)
  }, [])

  const toggle = useCallback(() => {
    setThemeState((current) => (current === 'obsidian' ? 'white' : 'obsidian'))
  }, [])

  const value = useMemo(
    () => ({ theme, setTheme, toggle }),
    [theme, setTheme, toggle],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
