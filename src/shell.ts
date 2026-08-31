import { profile, type Role, type ThemeName } from './data/profile'

export type ShellLine = {
  kind: 'out' | 'err' | 'dim' | 'blank'
  text: string
}

export type ShellEffect =
  | { type: 'clear' }
  | { type: 'theme'; value: ThemeName | 'toggle' }
  | { type: 'download' }
  | { type: 'scroll'; id: string }
  | { type: 'link'; href: string }

export type ShellResult = {
  lines: ShellLine[]
  effect?: ShellEffect
  cwd?: string
}

type FileNode = {
  type: 'file'
  name: string
  body: string
}

type DirNode = {
  type: 'dir'
  name: string
  children: Record<string, FsNode>
}

type FsNode = FileNode | DirNode

const COMMANDS = [
  'help',
  'whoami',
  'about',
  'skills',
  'work',
  'experience',
  'open',
  'contact',
  'hire',
  'cv',
  'resume',
  'theme',
  'ls',
  'cat',
  'cd',
  'pwd',
  'clear',
  'history',
  'neofetch',
  'stack',
  'goto',
  'echo',
  'date',
  'man',
  'linkedin',
  'telegram',
  'email',
  'ping',
  'uptime',
  'sudo',
  'vim',
  'exit',
] as const

function wrap(text: string, width = 78): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > width) {
      if (current) lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines
}

function out(text: string): ShellLine {
  return { kind: 'out', text }
}

function dim(text: string): ShellLine {
  return { kind: 'dim', text }
}

function err(text: string): ShellLine {
  return { kind: 'err', text }
}

function blank(): ShellLine {
  return { kind: 'blank', text: '' }
}

function block(text: string): ShellLine[] {
  return wrap(text).map(out)
}

function roleBody(role: Role): string {
  const lines = [
    `${role.role}  ·  ${role.company}`,
    role.period + (role.kind ? `  ·  ${role.kind}` : ''),
    '',
    role.product,
  ]
  if (role.problem) {
    lines.push('', `Problem: ${role.problem}`)
  }
  lines.push('', 'Highlights:')
  for (const item of role.highlights) lines.push(`  • ${item}`)
  if (role.products) {
    for (const product of role.products) {
      lines.push('', product.name, product.body)
      for (const item of product.highlights) lines.push(`  • ${item}`)
    }
  }
  lines.push('', `Stack: ${role.stack.join(', ')}`)
  return lines.join('\n')
}

function buildFs(): DirNode {
  const workChildren: Record<string, FsNode> = {}
  for (const role of profile.experience) {
    workChildren[role.file] = {
      type: 'file',
      name: role.file,
      body: roleBody(role),
    }
  }

  return {
    type: 'dir',
    name: '~',
    children: {
      'about.md': {
        type: 'file',
        name: 'about.md',
        body: `${profile.name}\n${profile.title}\n\n${profile.summary}\n\n${profile.pitch}`,
      },
      'skills.md': {
        type: 'file',
        name: 'skills.md',
        body: profile.skillGroups
          .map((group) => `${group.label}\n  ${group.items.join(', ')}`)
          .join('\n\n'),
      },
      'contact.md': {
        type: 'file',
        name: 'contact.md',
        body: [
          `email      ${profile.email}`,
          `telegram   ${profile.telegram}`,
          `linkedin   ${profile.linkedin}`,
          `phone      ${profile.phone}`,
          `cv         ${profile.cvPath}`,
        ].join('\n'),
      },
      'cv.pdf': {
        type: 'file',
        name: 'cv.pdf',
        body: 'PDF',
      },
      work: {
        type: 'dir',
        name: 'work',
        children: workChildren,
      },
    },
  }
}

const fsRoot = buildFs()

function normalize(path: string): string {
  const parts = path.split('/').filter((part) => part && part !== '.')
  const stack: string[] = []
  for (const part of parts) {
    if (part === '..') stack.pop()
    else stack.push(part)
  }
  return stack.join('/')
}

function resolvePath(cwd: string, input?: string): string {
  if (!input || input === '~') return ''
  if (input.startsWith('~/')) return normalize(input.slice(2))
  if (input.startsWith('/')) return normalize(input)
  return normalize(cwd ? `${cwd}/${input}` : input)
}

function lookup(path: string): FsNode | null {
  if (!path) return fsRoot
  const parts = path.split('/').filter(Boolean)
  let node: FsNode = fsRoot
  for (const part of parts) {
    if (node.type !== 'dir') return null
    const next: FsNode | undefined = node.children[part]
    if (!next) return null
    node = next
  }
  return node
}

function displayPath(cwd: string): string {
  return cwd ? `~/${cwd}` : '~'
}

function helpLines(): ShellLine[] {
  return [
    dim('Available commands'),
    blank(),
    out('  help                 this list'),
    out('  whoami / about       profile'),
    out('  skills [group]       stack'),
    out('  work / experience    roles'),
    out('  open <id>            pait | yldx | cyno | dwellers'),
    out('  contact / hire       how to reach me'),
    out('  cv / resume          download PDF'),
    out('  theme [obsidian|white|toggle]'),
    out('  goto <section>       work | skills | terminal | contact'),
    out('  ls / cd / cat / pwd  filesystem'),
    out('  neofetch / stack     system snapshot'),
    out('  clear                wipe the screen'),
    blank(),
    dim('Tab completes. ↑ ↓ walks history.'),
  ]
}

function skillsLines(filter?: string): ShellLine[] {
  const query = filter?.toLowerCase()
  const groups = query
    ? profile.skillGroups.filter(
        (group) =>
          group.id.includes(query) || group.label.toLowerCase().includes(query),
      )
    : profile.skillGroups

  if (!groups.length) {
    return [err(`no skill group matching "${filter}"`)]
  }

  const lines: ShellLine[] = []
  for (const group of groups) {
    lines.push(dim(group.label.toUpperCase()))
    lines.push(out(`  ${group.items.join('  ·  ')}`))
    lines.push(blank())
  }
  return lines
}

function workIndex(): ShellLine[] {
  const lines: ShellLine[] = [dim('Work'), blank()]
  for (const role of profile.experience) {
    lines.push(out(`  ${role.id.padEnd(10)} ${role.company}`))
    lines.push(dim(`             ${role.role}  ·  ${role.period}`))
  }
  lines.push(blank(), dim('open <id>   or   cat work/<file>'))
  return lines
}

function neofetch(theme: ThemeName): ShellLine[] {
  const art = [
    '        ██████████        ',
    '      ██          ██      ',
    '     ██   EL  ·   ██     ',
    '     ██  backend  ██     ',
    '      ██          ██      ',
    '        ██████████        ',
  ]
  const info = [
    `${profile.name}@${profile.host}`,
    '----------------------',
    `Role      ${profile.title}`,
    `Years     ${profile.years}`,
    `Langs     TypeScript, Go`,
    `Core      NestJS, Kafka, gRPC`,
    `Chain     Solana, TON, EVM`,
    `Theme     ${theme}`,
    `Shell     zsh 5.9`,
    `Host      portfolio`,
  ]
  const lines: ShellLine[] = []
  const rows = Math.max(art.length, info.length)
  for (let i = 0; i < rows; i += 1) {
    const left = (art[i] ?? '                          ').padEnd(28)
    const right = info[i] ?? ''
    lines.push(out(`${left}${right}`))
  }
  return lines
}

function parse(raw: string): { cmd: string; args: string[] } {
  const parts = raw.trim().split(/\s+/).filter(Boolean)
  const cmd = (parts[0] ?? '').toLowerCase()
  return { cmd, args: parts.slice(1) }
}

export function complete(input: string, cwd: string): string {
  const trimmed = input
  const parts = trimmed.split(/\s+/)
  if (parts.length <= 1) {
    const prefix = (parts[0] ?? '').toLowerCase()
    const hits = COMMANDS.filter((name) => name.startsWith(prefix))
    return hits.length === 1 ? hits[0] : input
  }

  const cmd = parts[0]?.toLowerCase() ?? ''
  const last = parts[parts.length - 1] ?? ''
  if (cmd === 'theme') {
    const hits = ['obsidian', 'white', 'toggle'].filter((name) =>
      name.startsWith(last.toLowerCase()),
    )
    if (hits.length === 1) return `${cmd} ${hits[0]}`
  }
  if (cmd === 'open') {
    const hits = profile.experience
      .map((role) => role.id)
      .filter((id) => id.startsWith(last.toLowerCase()))
    if (hits.length === 1) return `${cmd} ${hits[0]}`
  }
  if (cmd === 'goto') {
    const hits = ['work', 'skills', 'terminal', 'contact', 'top'].filter((id) =>
      id.startsWith(last.toLowerCase()),
    )
    if (hits.length === 1) return `${cmd} ${hits[0]}`
  }
  if (cmd === 'cd' || cmd === 'cat' || cmd === 'ls' || cmd === 'open') {
    const resolved = resolvePath(cwd, last)
    const parentPath = resolved.includes('/')
      ? resolved.slice(0, resolved.lastIndexOf('/'))
      : cwd && !last.includes('/')
        ? cwd
        : ''
    const base = last.includes('/') ? last.slice(last.lastIndexOf('/') + 1) : last
    const dir = lookup(last.includes('/') ? parentPath : cwd)
    if (dir?.type === 'dir') {
      const hits = Object.keys(dir.children).filter((name) => name.startsWith(base))
      if (hits.length === 1) {
        const prefix = last.includes('/') ? last.slice(0, last.lastIndexOf('/') + 1) : ''
        const node = dir.children[hits[0]]
        const suffix = node?.type === 'dir' ? '/' : ''
        return `${parts.slice(0, -1).join(' ')} ${prefix}${hits[0]}${suffix}`
      }
    }
  }
  if (cmd === 'skills') {
    const hits = profile.skillGroups
      .map((group) => group.id)
      .filter((id) => id.startsWith(last.toLowerCase()))
    if (hits.length === 1) return `${cmd} ${hits[0]}`
  }
  return input
}

export function runCommand(
  raw: string,
  cwd: string,
  theme: ThemeName,
  history: string[],
): ShellResult {
  const trimmed = raw.trim()
  if (!trimmed) return { lines: [] }

  const { cmd, args } = parse(trimmed)
  const arg = args.join(' ')

  switch (cmd) {
    case 'help':
    case '?':
    case 'man':
      if (cmd === 'man' && args[0] && args[0] !== 'help') {
        return { lines: [out(`No manual entry for ${args[0]}. Try help.`)] }
      }
      return { lines: helpLines() }

    case 'whoami':
      return {
        lines: [
          out(`${profile.name}  —  ${profile.title}`),
          dim('event-driven systems  ·  gRPC  ·  Web3 fintech'),
        ],
      }

    case 'about':
      return { lines: [...block(profile.summary), blank(), ...block(profile.pitch)] }

    case 'skills':
      return { lines: skillsLines(args[0]) }

    case 'stack':
      return {
        lines: [
          out('NestJS  ·  Go  ·  TypeScript'),
          out('PostgreSQL  ·  Redis  ·  Prisma'),
          out('Kafka  ·  BullMQ  ·  gRPC'),
          out('Solana  ·  TON  ·  EVM'),
          out('Docker  ·  Jest  ·  Testcontainers'),
        ],
      }

    case 'work':
    case 'experience':
    case 'jobs':
      return { lines: workIndex() }

    case 'open': {
      const id = args[0]?.toLowerCase()
      if (!id) return { lines: [err('usage: open <pait|yldx|cyno|dwellers>')] }
      const role = profile.experience.find((item) => item.id === id)
      if (!role) return { lines: [err(`unknown role "${id}"`)] }
      const lines = roleBody(role)
        .split('\n')
        .map((line) => (line.startsWith('  •') ? out(line) : line ? out(line) : blank()))
      return { lines, effect: { type: 'scroll', id: `role-${role.id}` } }
    }

    case 'contact':
    case 'hire':
      return {
        lines: [
          out('Available for backend roles and contract systems work.'),
          blank(),
          out(`  email      ${profile.email}`),
          out(`  telegram   ${profile.telegram}`),
          out(`  linkedin   ${profile.linkedin}`),
          out(`  phone      ${profile.phone}`),
          blank(),
          dim('email | telegram | linkedin | cv'),
        ],
      }

    case 'cv':
    case 'resume':
      return {
        lines: [out('Opening EL-backend-CV.pdf …')],
        effect: { type: 'download' },
      }

    case 'theme': {
      const value = (args[0] ?? 'toggle').toLowerCase()
      if (value === 'toggle' || value === 'obsidian' || value === 'white') {
        return {
          lines: [out(`theme → ${value === 'toggle' ? (theme === 'obsidian' ? 'white' : 'obsidian') : value}`)],
          effect: { type: 'theme', value: value as ThemeName | 'toggle' },
        }
      }
      return { lines: [err('usage: theme [obsidian|white|toggle]')] }
    }

    case 'goto': {
      const id = (args[0] ?? '').toLowerCase()
      const map: Record<string, string> = {
        work: 'work',
        skills: 'skills',
        terminal: 'terminal',
        contact: 'contact',
        top: 'top',
        about: 'top',
        home: 'top',
      }
      if (!map[id]) return { lines: [err('usage: goto work|skills|terminal|contact|top')] }
      return {
        lines: [dim(`→ ${map[id]}`)],
        effect: { type: 'scroll', id: map[id] },
      }
    }

    case 'pwd':
      return { lines: [out(displayPath(cwd))] }

    case 'ls': {
      const target = lookup(resolvePath(cwd, args[0]))
      if (!target) return { lines: [err(`ls: ${args[0] ?? '.'}: no such file or directory`)] }
      if (target.type === 'file') return { lines: [out(target.name)] }
      const names = Object.values(target.children).map((node) =>
        node.type === 'dir' ? `${node.name}/` : node.name,
      )
      return { lines: names.length ? [out(names.join('    '))] : [dim('(empty)')] }
    }

    case 'cd': {
      const dest = args[0] ?? '~'
      const path = resolvePath(cwd, dest)
      const node = lookup(path)
      if (!node) return { lines: [err(`cd: no such file or directory: ${dest}`)] }
      if (node.type !== 'dir') return { lines: [err(`cd: not a directory: ${dest}`)] }
      return { lines: [], cwd: path }
    }

    case 'cat': {
      if (!args[0]) return { lines: [err('usage: cat <file>')] }
      const path = resolvePath(cwd, args[0])
      const node = lookup(path)
      if (!node) return { lines: [err(`cat: ${args[0]}: no such file or directory`)] }
      if (node.type === 'dir') return { lines: [err(`cat: ${args[0]}: is a directory`)] }
      if (node.name.endsWith('.pdf')) {
        return {
          lines: [out('PDF — use `cv` to download.')],
          effect: { type: 'download' },
        }
      }
      return {
        lines: node.body.split('\n').map((line) => (line ? out(line) : blank())),
      }
    }

    case 'clear':
    case 'cls':
      return { lines: [], effect: { type: 'clear' } }

    case 'history':
      return {
        lines: history.map((item, index) => out(`  ${String(index + 1).padStart(4)}  ${item}`)),
      }

    case 'neofetch':
    case 'fastfetch':
    case 'fetch':
      return { lines: neofetch(theme) }

    case 'echo':
      return { lines: [out(arg)] }

    case 'date':
      return { lines: [out(new Date().toString())] }

    case 'linkedin':
      return {
        lines: [out(profile.linkedin)],
        effect: { type: 'link', href: profile.linkedin },
      }

    case 'telegram':
      return {
        lines: [out(profile.telegramUrl)],
        effect: { type: 'link', href: profile.telegramUrl },
      }

    case 'email':
    case 'mail':
      return {
        lines: [out(profile.email)],
        effect: { type: 'link', href: `mailto:${profile.email}` },
      }

    case 'ping':
      return {
        lines: [
          out(`PING ${args[0] ?? 'lapshin.dev'} (127.0.0.1): 56 data bytes`),
          out('64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.4 ms'),
          out('64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.3 ms'),
          dim('this machine is local. for people, use contact.'),
        ],
      }

    case 'uptime':
      return { lines: [out(`up ${profile.years} years, 1 user, load: kafka, grpc, on-chain`)] }

    case 'sudo':
      return { lines: [err('sudo: not in sudoers. this host is already yours — try hire.')] }

    case 'vim':
    case 'vi':
    case 'nvim':
      return { lines: [dim("i've written enough editors. try cat about.md")] }

    case 'exit':
    case 'logout':
      return { lines: [dim('session stays attached. scroll, or type hire.')] }

    default:
      return { lines: [err(`command not found: ${cmd}. type help.`)] }
  }
}

export { COMMANDS }
