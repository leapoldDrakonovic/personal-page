export type ThemeName = 'obsidian' | 'white'

export type SkillGroup = {
  id: string
  label: string
  items: string[]
}

export type Product = {
  name: string
  body: string
  highlights: string[]
}

export type Role = {
  id: string
  file: string
  company: string
  role: string
  period: string
  kind?: string
  product: string
  problem?: string
  highlights: string[]
  stack: string[]
  products?: Product[]
}

export const profile = {
  name: 'Egor Lapshin',
  title: 'Backend Developer',
  handle: 'egor',
  host: 'lapshin',
  location: 'Available remotely',
  email: 'lapshinegor7@gmail.com',
  telegram: '@fisshbait',
  telegramUrl: 'https://t.me/fisshbait',
  phone: '+381 65 4473379',
  phoneUrl: 'tel:+381654473379',
  linkedin: 'https://www.linkedin.com/in/egor-lapshin/',
  cvPath: '/EL-backend-CV.pdf',
  years: '5+',
  summary:
    'Developer with 5+ years of professional software development experience, having moved from frontend into backend and distributed systems since 2023. Designs and ships event-driven microservice architectures, gRPC-based inter-service communication, and Web3 integrations (Solana, TON) for fintech and consumer products.',
  pitch:
    'I design backends that cannot afford to be wrong — event-driven microservices, gRPC, and on-chain integrations for products that move money.',
  skillGroups: [
    {
      id: 'languages',
      label: 'Languages & frameworks',
      items: ['Node.js', 'NestJS', 'Go', 'TypeScript', 'JavaScript'],
    },
    {
      id: 'data',
      label: 'Data layer',
      items: ['PostgreSQL', 'MongoDB', 'Redis', 'Redis Streams', 'Prisma ORM'],
    },
    {
      id: 'messaging',
      label: 'Messaging & queues',
      items: ['BullMQ', 'Kafka', 'RabbitMQ'],
    },
    {
      id: 'infra',
      label: 'Infra & observability',
      items: ['Docker', 'Sentry', 'New Relic'],
    },
    {
      id: 'devops',
      label: 'DevOps',
      items: ['GitHub CI', 'GitLab CI', 'DigitalOcean', 'Timeweb'],
    },
    {
      id: 'testing',
      label: 'Testing',
      items: ['Jest', 'Testcontainers', 'Go test'],
    },
    {
      id: 'architecture',
      label: 'Architecture',
      items: ['Microservices', 'Event-driven design', 'gRPC', 'DDD'],
    },
    {
      id: 'blockchain',
      label: 'Blockchain',
      items: ['Solana', 'Ethereum (EVM)', 'TON', 'Ethers.js', 'web3'],
    },
  ] satisfies SkillGroup[],
  experience: [
    {
      id: 'pait',
      file: 'pait.md',
      company: 'PaIT.Fi',
      role: 'Backend Developer',
      period: 'Feb 2026 — Aug 2026',
      kind: 'Project',
      product:
        'Token-based crypto platform with an integrated digital wallet, smart-contract interactions, tiered investment packages, and a referral partner system.',
      problem:
        'Build a secure, scalable platform where users purchase and manage a proprietary token, join tiered packages, interact with smart contracts, and earn through referrals.',
      highlights: [
        'Designed an event-driven Kafka architecture spanning 19 services across 2 applications — token operations, users, packages, calculations, and referrals.',
        'Shipped a reusable internal backend library that standardized common services and cut duplicated work across microservices.',
        'Implemented centralized 2FA and SSO across 2 applications, with webhook sync at 99% delivery reliability via automatic retries.',
        'Built a BullMQ processing system handling ~15K jobs/day without blocking user-facing requests.',
        'Integrated smart contracts via Moralis to automate and enforce participant rules on-chain.',
        'Worked with security to find and remediate vulnerabilities on a platform handling token and financial operations.',
        'Added unit and integration tests with Jest and Testcontainers — 60% coverage of unit and core business-logic integration.',
      ],
      stack: [
        'NestJS',
        'PostgreSQL',
        'Redis',
        'BullMQ',
        'Kafka',
        'gRPC',
        'Prisma',
        'Sentry',
        'New Relic',
        'Docker',
        'Go',
      ],
    },
    {
      id: 'yldx',
      file: 'yldx.md',
      company: 'Defi Bank Online / YLDX.ai',
      role: 'Backend Developer',
      period: '2025 — 2026',
      product: 'Admin platform for managing multiple white-label DeFi / fintech partners.',
      problem:
        'Give the company a single administrative system for independent white-label partners — with access control, reliable sync, and unified performance monitoring.',
      highlights: [
        'Designed a gRPC microservice architecture separating administrative, partner, and data-processing domains.',
        'Implemented RBAC so administrators provision role-based users while users set passwords and OTP themselves.',
        'Built a Go relayer that syncs partner systems into the central platform, replacing manual transfer with a consistent data layer.',
        'Shipped a black-box metrics engine that normalizes performance across white-label environments without leaking partner internals.',
      ],
      stack: ['NestJS', 'PostgreSQL', 'Go', 'Redis', 'Prisma', 'gRPC'],
    },
    {
      id: 'cyno',
      file: 'cyno.md',
      company: 'CYNO.ONE (then YLDX.ai)',
      role: 'Backend Developer',
      period: '2023 — 2025',
      product: 'Three production products: consumer crypto, Solana trading, and B2B fleet finance.',
      highlights: [
        'Telegram Mini App with TON and internal balances, now live at 117,000+ monthly active users.',
        'Caught a post-launch race in concurrent balances (double-spend risk) and fixed it with PostgreSQL Serializable isolation.',
        'Solana trading backend watching PumpSwap pools over WebSocket, with automated execution and event-driven detection instead of polling.',
        'Patched the PumpSwap SDK after a breaking protocol change so swaps kept running without waiting on upstream.',
        'Transmatika: B2B cost-control platform for fuel cards, tolls, tax refunds, and fleet analytics.',
      ],
      stack: ['NestJS', 'PostgreSQL', 'TON', 'Solana', 'WebSocket', 'Redis'],
      products: [
        {
          name: 'Telegram Mini App',
          body: 'Purchase, send, open, and withdraw digital gifts with TON integration and an internal balance.',
          highlights: [
            'Shipped the Mini App with TON, internal balance, and gift send/withdraw flows.',
            'Found a race in concurrent balance operations after launch — a double-spend risk.',
            'Redesigned transactions with PostgreSQL Serializable isolation and eliminated the bug.',
            'Handed the product to the owner; currently live with 117,000+ MAU.',
          ],
        },
        {
          name: 'Solana trading infrastructure',
          body: 'Automated trading backend for a private team on the Solana token market.',
          highlights: [
            'Monitored PumpSwap liquidity pools via WebSocket and detected liquidity migration in real time.',
            'Automated buy/sell execution from configurable trading filters.',
            'Patched the open-source PumpSwap SDK after a breaking protocol change.',
            'Designed around chain events instead of polling — lower latency, fewer API calls.',
          ],
        },
        {
          name: 'Transmatika',
          body: 'B2B platform for transportation companies: fuel cards, toll roads, tax refunds, cost control, fleet analytics.',
          highlights: [
            'Centralized fuel-card and transportation expense management.',
            'Event-driven workflows for real-time card activity and expenses.',
            'Reporting and analytics backends for operators and management.',
            'Automated cost-control processes that cut manual ops work.',
          ],
        },
      ],
    },
    {
      id: 'dwellers',
      file: 'dwellers.md',
      company: 'LLC Dwellers',
      role: 'Frontend Developer',
      period: '2021 — 2023',
      product: 'Real-estate marketplace for the Israeli market.',
      highlights: [
        'Built the marketplace MVP from scratch.',
        'Designed a custom UI kit in Tailwind, prototyping every component before implementation.',
        'Integrated a Python/FastAPI backend and shipped user/seller dashboards with custom Mapbox views.',
      ],
      stack: ['React.js', 'Redux', 'Tailwind CSS', 'Mapbox', 'Flask', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    },
  ] satisfies Role[],
} as const

export const nav = [
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'contact', label: 'Contact' },
] as const
