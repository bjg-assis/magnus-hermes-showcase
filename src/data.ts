/* Static content for the Magnus / Hermes showcase.
   Everything here is descriptive, public-safe copy — no credentials,
   no addresses, no private data. */

export type NodeId =
  | 'telegram'
  | 'magnus'
  | 'apollo'
  | 'nestor'
  | 'obsidian'
  | 'homeassistant'
  | 'web'
  | 'boris'
  | 'sterling'
  | 'professor'

export type Accent = 'cyan' | 'amber' | 'green' | 'rose' | 'ice'

export interface MapNode {
  id: NodeId
  name: string
  role: string
  x: number
  y: number
  r: number
  accent: Accent
  icon: string
  satellite?: boolean
  facts: string[]
  body: string[]
}

export const NODES: MapNode[] = [
  {
    id: 'telegram',
    name: 'Telegram',
    role: 'The front door',
    x: 118,
    y: 330,
    r: 40,
    accent: 'ice',
    icon: 'chat',
    facts: ['Works from any phone', 'Text, voice notes, photos', 'The only door in'],
    body: [
      'Every conversation starts here. Benjamin sends a message from his phone — a question, a task, a half-formed idea — exactly like texting a friend.',
      'Telegram is the single doorway into the whole system. Nothing else is exposed to the outside world, which keeps the constellation private by design.',
    ],
  },
  {
    id: 'magnus',
    name: 'Magnus',
    role: 'The coordinator · Mac mini (i7)',
    x: 500,
    y: 330,
    r: 56,
    accent: 'cyan',
    icon: 'hub',
    facts: ['Always on, 24/7', 'Canonical hub', 'Plans, routes, remembers'],
    body: [
      'Magnus is the heart of the operation — an always-on Mac mini that never sleeps. When a message arrives, Magnus reads it, makes a plan, and decides who or what should handle it.',
      'Think of an air-traffic controller crossed with a chief of staff: Magnus rarely does everything personally, but everything passes through Magnus, and Magnus keeps the canonical record of what happened.',
    ],
  },
  {
    id: 'apollo',
    name: 'Apollo',
    role: 'Remote worker · Mac mini (i5)',
    x: 846,
    y: 178,
    r: 44,
    accent: 'green',
    icon: 'worker',
    facts: ['Second Mac mini', 'Joined via Tailscale tunnel', 'Takes the heavy lifting'],
    body: [
      'Apollo is a second Mac mini that lives on the same private network, reached through a secure Tailscale tunnel — a glowing private wire that only these machines can use.',
      'When Magnus has long or heavy work — big research jobs, code builds, batch tasks — Apollo takes it on so the hub stays fast and responsive.',
    ],
  },
  {
    id: 'nestor',
    name: 'Nestor',
    role: 'Strategic commander · MacBook',
    x: 846,
    y: 478,
    r: 44,
    accent: 'amber',
    icon: 'laptop',
    facts: ['Lives on the MacBook', 'Online when mobile', 'Big-picture thinking'],
    body: [
      'Nestor rides along on the MacBook, so it appears in the constellation whenever Benjamin is out and about with the laptop open.',
      'Where Magnus coordinates, Nestor commands: it is the strategic voice for planning, reviewing, and steering bigger projects — and it hands work back to Magnus when the lid closes.',
    ],
  },
  {
    id: 'obsidian',
    name: 'Obsidian Vault',
    role: 'The memory garden',
    x: 268,
    y: 548,
    r: 42,
    accent: 'rose',
    icon: 'vault',
    facts: ['Notes & long-term memory', 'Grows over time', 'Readable by every agent'],
    body: [
      'The Obsidian vault is the library of the constellation — a garden of interlinked notes where ideas, decisions, and context are planted and tended.',
      'Agents read it to remember what matters and write back what they learn, so the system gets more personal and more useful the longer it runs.',
    ],
  },
  {
    id: 'homeassistant',
    name: 'Home Assistant',
    role: 'The smart-home bridge',
    x: 672,
    y: 560,
    r: 42,
    accent: 'amber',
    icon: 'house',
    facts: ['Lights, sensors, scenes', 'Private network only', 'Asks before acting'],
    body: [
      'Home Assistant is the bridge between the digital constellation and the physical house — lights, sensors, heating, scenes.',
      'It is reachable only over the private network, never the open internet, so "turn the studio lights warm" travels safely from a Telegram message to an actual bulb.',
    ],
  },
  {
    id: 'web',
    name: 'The Open Web',
    role: 'The outside world',
    x: 500,
    y: 86,
    r: 38,
    accent: 'ice',
    icon: 'globe',
    facts: ['Search & research', 'Read-mostly', 'Carefully fenced'],
    body: [
      'When a task needs fresh information — news, prices, documentation — agents reach out to the web with search, scraping, and a real browser.',
      'Traffic flows out and answers flow back, but the door only opens from the inside: the web can never reach into the constellation.',
    ],
  },
  {
    id: 'boris',
    name: 'Boris',
    role: 'Standby specialist · The builder',
    x: 0,
    y: 0,
    r: 20,
    accent: 'green',
    icon: 'wrench',
    satellite: true,
    facts: ['On standby aboard Magnus', 'Blunt, practical, fast', 'Summoned for hands-on builds'],
    body: [
      'Boris is a specialist profile that sleeps aboard the hub until summoned. No small talk — Boris exists to build, fix, and ship.',
      'When a task is pure engineering, Magnus wakes Boris, hands over the brief, and gets out of the way.',
    ],
  },
  {
    id: 'sterling',
    name: 'Sterling',
    role: 'Standby specialist · The wordsmith',
    x: 0,
    y: 0,
    r: 20,
    accent: 'ice',
    icon: 'quill',
    satellite: true,
    facts: ['On standby aboard Magnus', 'Polished prose & messages', 'Summoned for writing'],
    body: [
      'Sterling is the voice of the constellation when words need to be precise, warm, or persuasive — letters, summaries, anything written for human eyes.',
      'Like the other specialists, Sterling waits quietly on the hub until Magnus decides a task deserves the polished touch.',
    ],
  },
  {
    id: 'professor',
    name: 'The Professor',
    role: 'Standby specialist · The scholar',
    x: 0,
    y: 0,
    r: 20,
    accent: 'rose',
    icon: 'book',
    satellite: true,
    facts: ['On standby aboard Magnus', 'Deep research & teaching', 'Summoned for hard questions'],
    body: [
      'The Professor is summoned for the questions that deserve more than a quick answer — deep research, careful comparison, patient explanation.',
      'Findings get written back into the Obsidian vault, so a question answered once becomes knowledge the whole constellation keeps.',
    ],
  },
]

export interface Edge {
  id: string
  from: NodeId
  to: NodeId
  path: string
  tailscale?: boolean
}

export const EDGES: Edge[] = [
  { id: 'tg-mag', from: 'telegram', to: 'magnus', path: 'M 118 330 Q 310 288 500 330' },
  { id: 'mag-web', from: 'magnus', to: 'web', path: 'M 500 330 Q 478 200 500 86' },
  { id: 'mag-apollo', from: 'magnus', to: 'apollo', path: 'M 500 330 Q 690 222 846 178', tailscale: true },
  { id: 'mag-nestor', from: 'magnus', to: 'nestor', path: 'M 500 330 Q 690 432 846 478', tailscale: true },
  { id: 'mag-obsidian', from: 'magnus', to: 'obsidian', path: 'M 500 330 Q 370 460 268 548' },
  { id: 'mag-ha', from: 'magnus', to: 'homeassistant', path: 'M 500 330 Q 610 462 672 560' },
]

export interface DemoStep {
  caption: string
  detail: string
  path?: string
  highlight: NodeId[]
  edgeId?: string
}

export const DEMO_STEPS: DemoStep[] = [
  {
    caption: 'A message takes flight',
    detail: 'Benjamin texts: "Plan my Saturday — and warm up the studio."',
    path: 'M 118 330 Q 310 288 500 330',
    highlight: ['telegram', 'magnus'],
    edgeId: 'tg-mag',
  },
  {
    caption: 'Magnus makes a plan',
    detail: 'The coordinator splits the request: research, memory, and one real-world action.',
    highlight: ['magnus'],
  },
  {
    caption: 'Scouts head for the web',
    detail: 'Search and browser tools fetch weather, opening hours, and ideas.',
    path: 'M 500 330 Q 478 200 500 86',
    highlight: ['magnus', 'web'],
    edgeId: 'mag-web',
  },
  {
    caption: 'The vault remembers',
    detail: 'Obsidian notes recall preferences: no early starts, loves coastal walks.',
    path: 'M 500 330 Q 370 460 268 548',
    highlight: ['magnus', 'obsidian'],
    edgeId: 'mag-obsidian',
  },
  {
    caption: 'Apollo takes the heavy load',
    detail: 'The deep itinerary research is delegated over the secure Tailscale tunnel.',
    path: 'M 500 330 Q 690 222 846 178',
    highlight: ['magnus', 'apollo'],
    edgeId: 'mag-apollo',
  },
  {
    caption: 'The house responds',
    detail: 'Home Assistant nudges the studio heating — privately, on the home network.',
    path: 'M 500 330 Q 610 462 672 560',
    highlight: ['magnus', 'homeassistant'],
    edgeId: 'mag-ha',
  },
  {
    caption: 'The answer flies home',
    detail: 'Magnus assembles everything into one tidy reply back to Telegram.',
    path: 'M 500 330 Q 310 288 118 330',
    highlight: ['magnus', 'telegram'],
    edgeId: 'tg-mag',
  },
]

export interface ToolCard {
  name: string
  blurb: string
  icon: string
}

export const TOOLS: ToolCard[] = [
  { name: 'Web Search', blurb: 'Scouts the open internet for fresh answers.', icon: 'globe' },
  { name: 'Browser', blurb: 'Drives a real browser — clicks, reads, fills forms.', icon: 'browser' },
  { name: 'Firecrawl', blurb: 'Harvests whole websites into clean, readable notes.', icon: 'flame' },
  { name: 'Files', blurb: 'Reads and writes documents across the machines.', icon: 'files' },
  { name: 'Terminal', blurb: 'Speaks directly to the computers in their own language.', icon: 'terminal' },
  { name: 'GitHub', blurb: 'Keeps code projects versioned, reviewed, and shipped.', icon: 'branch' },
  { name: 'Home Assistant', blurb: 'Touches the physical world: lights, heat, scenes.', icon: 'house' },
  { name: 'Scheduler', blurb: 'Sets alarms for itself — routines that run on time, every time.', icon: 'clock' },
  { name: 'Messages', blurb: 'Sends results and check-ins back through Telegram.', icon: 'chat' },
]

export interface SkillCard {
  name: string
  blurb: string
}

export const SKILLS: SkillCard[] = [
  { name: 'Morning Briefing', blurb: 'Weather, calendar, and overnight news, distilled before breakfast.' },
  { name: 'Deep Research', blurb: 'Fan out across many sources, cross-check, return one trustworthy answer.' },
  { name: 'Vault Gardening', blurb: 'Tidy, link, and grow the Obsidian knowledge garden.' },
  { name: 'Home Routines', blurb: 'Orchestrate lights, heating, and scenes around real life.' },
  { name: 'Build & Ship', blurb: 'Take a software idea from sketch to working, tested code.' },
  { name: 'Inbox Triage', blurb: 'Sort the important from the ignorable and draft the replies.' },
  { name: 'Watchkeeper', blurb: 'Monitor pages and feeds; speak up only when something truly changes.' },
  { name: 'Trip Planner', blurb: 'Turn "somewhere nice this weekend?" into a full itinerary.' },
]

export interface ModelCartridge {
  name: string
  maker: string
  vibe: string
  accent: Accent
}

export const MODELS: ModelCartridge[] = [
  { name: 'Fable 5', maker: 'Anthropic', vibe: 'The flagship mind — deepest reasoning', accent: 'cyan' },
  { name: 'Opus', maker: 'Anthropic', vibe: 'Heavyweight thinker for hard problems', accent: 'amber' },
  { name: 'Sonnet', maker: 'Anthropic', vibe: 'The everyday workhorse', accent: 'green' },
  { name: 'Haiku', maker: 'Anthropic', vibe: 'Featherweight and lightning-fast', accent: 'ice' },
  { name: 'Codex / GPT', maker: 'OpenAI', vibe: 'A second opinion from another lab', accent: 'rose' },
]

export interface Persona {
  id: NodeId | 'future'
  name: string
  title: string
  status: 'always-on' | 'mobile' | 'remote' | 'standby' | 'future'
  statusLabel: string
  accent: Accent
  icon: string
  description: string
  traits: string[]
}

export const PERSONAS: Persona[] = [
  {
    id: 'magnus',
    name: 'Magnus',
    title: 'The Coordinator',
    status: 'always-on',
    statusLabel: 'Always on · hub',
    accent: 'cyan',
    icon: 'hub',
    description:
      'The calm centre of the constellation. Reads every request, makes the plan, picks the right helper, and keeps the canonical record. Lives on the always-on Mac mini.',
    traits: ['Organised', 'Reliable', 'Sees the whole board'],
  },
  {
    id: 'nestor',
    name: 'Nestor',
    title: 'The Strategist',
    status: 'mobile',
    statusLabel: 'When the MacBook wakes',
    accent: 'amber',
    icon: 'laptop',
    description:
      'The big-picture commander who travels with the MacBook. Steers long projects, reviews plans, and challenges assumptions — then hands the baton back to Magnus.',
    traits: ['Strategic', 'Decisive', 'Travels light'],
  },
  {
    id: 'apollo',
    name: 'Apollo',
    title: 'The Remote Worker',
    status: 'remote',
    statusLabel: 'Over the Tailscale tunnel',
    accent: 'green',
    icon: 'worker',
    description:
      'The tireless second pair of hands on its own Mac mini. Takes the long, heavy jobs — big research, builds, batch work — so the hub never slows down.',
    traits: ['Tireless', 'Heavy lifting', 'Quietly competent'],
  },
  {
    id: 'boris',
    name: 'Boris',
    title: 'The Builder',
    status: 'standby',
    statusLabel: 'Standby on the hub',
    accent: 'green',
    icon: 'wrench',
    description:
      'Blunt, practical, allergic to waffle. Summoned when something needs to be built, fixed, or shipped — and dismissed the moment it works.',
    traits: ['No-nonsense', 'Hands-on', 'Ships it'],
  },
  {
    id: 'sterling',
    name: 'Sterling',
    title: 'The Wordsmith',
    status: 'standby',
    statusLabel: 'Standby on the hub',
    accent: 'ice',
    icon: 'quill',
    description:
      'The polished voice for anything written for human eyes — letters, summaries, announcements. Believes every sentence deserves a second draft.',
    traits: ['Eloquent', 'Precise', 'Charming'],
  },
  {
    id: 'professor',
    name: 'The Professor',
    title: 'The Scholar',
    status: 'standby',
    statusLabel: 'Standby on the hub',
    accent: 'rose',
    icon: 'book',
    description:
      'Summoned for questions that deserve real depth. Researches patiently, compares sources, explains clearly — and files everything in the vault for next time.',
    traits: ['Curious', 'Thorough', 'Loves a footnote'],
  },
  {
    id: 'future',
    name: 'Future Workers',
    title: 'Seats held open',
    status: 'future',
    statusLabel: 'Recruiting',
    accent: 'amber',
    icon: 'plus',
    description:
      'The constellation is built to grow. New machines and new specialist personas can join the network at any time — each one just another star switched on.',
    traits: ['Expandable', 'Plug-in', 'Coming soon'],
  },
]

export interface JourneyStep {
  num: string
  title: string
  text: string
  icon: string
  accent: Accent
}

export const JOURNEY: JourneyStep[] = [
  {
    num: '01',
    title: 'You send a thought',
    text: 'A Telegram message from anywhere — a question, a task, a voice note. That is the entire learning curve.',
    icon: 'chat',
    accent: 'ice',
  },
  {
    num: '02',
    title: 'Magnus catches it',
    text: 'The always-on coordinator reads the message, checks context, and sketches a plan: what needs doing, and who should do it.',
    icon: 'hub',
    accent: 'cyan',
  },
  {
    num: '03',
    title: 'The right mind is chosen',
    text: 'A model is slotted in like an engine cartridge — Fable for deep thought, a fast model for quick jobs — and, if needed, a specialist persona is woken.',
    icon: 'cartridge',
    accent: 'amber',
  },
  {
    num: '04',
    title: 'Hands get to work',
    text: 'Skills (reusable playbooks) and tools (web, files, terminal, browser, GitHub) carry out the plan. Heavy jobs hop to Apollo over the secure tunnel.',
    icon: 'wrench',
    accent: 'green',
  },
  {
    num: '05',
    title: 'Memory and home join in',
    text: 'The Obsidian vault supplies what the constellation already knows; Home Assistant handles anything physical, safely inside the private network.',
    icon: 'vault',
    accent: 'rose',
  },
  {
    num: '06',
    title: 'The answer returns',
    text: 'Magnus gathers every thread into one clear reply and sends it home to Telegram — with the useful parts saved to memory for next time.',
    icon: 'send',
    accent: 'cyan',
  },
]

export const STATS = [
  { label: 'Tools', value: TOOLS.length, hint: 'hands-on capabilities' },
  { label: 'Skills', value: SKILLS.length, hint: 'reusable playbooks' },
  { label: 'Models', value: MODELS.length, hint: 'swappable minds' },
  { label: 'Agents', value: 6, hint: 'named personas' },
] as const
