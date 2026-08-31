import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { profile } from '../data/profile'
import { complete, runCommand, type ShellLine } from '../shell'
import { useTheme } from '../theme'

type BufferLine = ShellLine & { id: number }

let lineSeq = 0

function nextId() {
  lineSeq += 1
  return lineSeq
}

function promptPath(cwd: string) {
  return cwd ? `~/${cwd}` : '~'
}

export function Terminal() {
  const { theme, setTheme, toggle } = useTheme()
  const [cwd, setCwd] = useState('')
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const [lines, setLines] = useState<BufferLine[]>(() => [
    { id: nextId(), kind: 'dim', text: 'Last login: on console' },
    { id: nextId(), kind: 'out', text: `${profile.handle}@${profile.host} ~ % whoami` },
    { id: nextId(), kind: 'out', text: `${profile.name}  —  ${profile.title}` },
    {
      id: nextId(),
      kind: 'dim',
      text: 'event-driven systems  ·  gRPC  ·  Web3 fintech',
    },
    { id: nextId(), kind: 'blank', text: '' },
    { id: nextId(), kind: 'dim', text: 'type help · tab completes · theme toggle' },
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [lines])

  function applyEffect(
    effect: ReturnType<typeof runCommand>['effect'],
  ) {
    if (!effect) return
    if (effect.type === 'theme') {
      if (effect.value === 'toggle') toggle()
      else setTheme(effect.value)
    }
    if (effect.type === 'download') {
      const link = document.createElement('a')
      link.href = profile.cvPath
      link.download = 'EL-backend-CV.pdf'
      link.click()
    }
    if (effect.type === 'scroll') {
      if (effect.id === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        document.getElementById(effect.id)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
    if (effect.type === 'link') {
      window.open(effect.href, '_blank', 'noopener,noreferrer')
    }
  }

  function submit(raw: string) {
    const value = raw.trim()
    const prompt = `${profile.handle}@${profile.host} ${promptPath(cwd)} % ${raw}`
    if (!value) {
      setLines((current) => [...current, { id: nextId(), kind: 'out', text: prompt }])
      return
    }

    const result = runCommand(value, cwd, theme, history)
    const nextHistory = [...history, value]
    setHistory(nextHistory)
    setHistIdx(-1)

    if (result.effect?.type === 'clear') {
      setLines([])
      if (result.cwd !== undefined) setCwd(result.cwd)
      return
    }

    const output: BufferLine[] = [
      { id: nextId(), kind: 'out', text: prompt },
      ...result.lines.map((line) => ({ ...line, id: nextId() })),
    ]
    setLines((current) => [...current, ...output])
    if (result.cwd !== undefined) setCwd(result.cwd)
    applyEffect(result.effect)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      submit(input)
      setInput('')
      return
    }
    if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault()
      setLines([])
      return
    }
    if (event.key === 'c' && event.ctrlKey) {
      setInput('')
      return
    }
    if (event.key === 'Tab') {
      event.preventDefault()
      setInput(complete(input, cwd))
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!history.length) return
      const next = histIdx < 0 ? history.length - 1 : Math.max(0, histIdx - 1)
      setHistIdx(next)
      setInput(history[next] ?? '')
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (histIdx < 0) return
      const next = histIdx + 1
      if (next >= history.length) {
        setHistIdx(-1)
        setInput('')
      } else {
        setHistIdx(next)
        setInput(history[next] ?? '')
      }
    }
  }

  return (
    <section className="section" id="terminal">
      <div className="wrap">
        <div className="section-head">
          <h2>The machine.</h2>
          <p className="term-intro">
            A local shell over this site. Try <code>help</code>, <code>open pait</code>,{' '}
            <code>skills</code>, <code>theme white</code>, or <code>cv</code>.
          </p>
        </div>
        <div
          className="term"
          onClick={() => inputRef.current?.focus()}
          onKeyDown={() => inputRef.current?.focus()}
          role="presentation"
        >
          <div className="term-chrome">
            <div className="traffic" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div className="term-title">
              {profile.handle}@{profile.host} — zsh
            </div>
            <div />
          </div>
          <div className="term-body" ref={bodyRef}>
            {lines.map((line) =>
              line.kind === 'blank' ? (
                <div className="term-line" key={line.id}>
                  {' '}
                </div>
              ) : (
                <div
                  className={`term-line${line.kind === 'dim' ? ' is-dim' : ''}${line.kind === 'err' ? ' is-err' : ''}`}
                  key={line.id}
                >
                  {line.text || ' '}
                </div>
              ),
            )}
            <div className="term-input-row">
              <span className="term-prompt">
                {profile.handle}@{profile.host} {promptPath(cwd)} %
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onKeyDown}
                aria-label="Terminal command"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
