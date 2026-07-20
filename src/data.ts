/* Static content for the Magnus showcase.
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
  | 'harvey'
  | 'surgeons'
  | 'aegis'
  | 'aiworker'
  | 'orcaforge'

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
    x: 150,
    y: 350,
    r: 40,
    accent: 'ice',
    icon: 'chat',
    facts: ['Works from any phone', 'Text, voice notes, photos', 'The only door in'],
    body: [
      'Every conversation starts here. Benjamin sends a message from his phone — a question, a task, a half-formed idea — exactly like texting a friend.',
      'Telegram is now also the control surface for serious operations: background AI Worker missions, weekly full-system updates, multi-agent build runs, and health reports all come back through the same simple chat.',
      'It remains the single public doorway into the system. Everything else stays on private hardware, private mesh networking, or carefully controlled cloud APIs.',
    ],
  },
  {
    id: 'magnus',
    name: 'Magnus',
    role: 'The coordinator · Mac mini (i7)',
    x: 500,
    y: 350,
    r: 60,
    accent: 'cyan',
    icon: 'hub',
    facts: ['Always on, 24/7', 'Canonical hub', 'Plans, routes, remembers', 'Coordinates weekly estate health'],
    body: [
      'Magnus is the heart of the operation — an always-on Mac mini that never sleeps. When a message arrives, Magnus reads it, makes a plan, and decides who or what should handle it.',
      'Think of an air-traffic controller crossed with a chief of staff: Magnus rarely does everything personally, but everything passes through Magnus, and Magnus keeps the canonical record of what happened.',
      'Recent infrastructure upgrades made Magnus more operationally mature: scheduled full-system updates, cross-machine parity checks, gateway restarts, Home Assistant verification, and rollback-ready operator reports.',
      'Surgeons’ Assistant and Aegis are shown here with Magnus as their intended future home: clinical and wellbeing specialists connected to the always-on hub.',
    ],
  },
  {
    id: 'apollo',
    name: 'Apollo',
    role: 'Remote worker · Mac mini (i5)',
    x: 846,
    y: 182,
    r: 44,
    accent: 'green',
    icon: 'worker',
    facts: ['Second Mac mini', 'Joined via Tailscale tunnel', 'Takes heavy lanes', 'Mirrors verified Hermes updates'],
    body: [
      'Apollo is a second Mac mini that lives on the same private network, reached through a secure Tailscale tunnel — a glowing private wire that only these machines can use.',
      'When Magnus has long or heavy work — big research jobs, code builds, batch tasks — Apollo takes it on so the hub stays fast and responsive.',
      'It now participates in the same safe update pipeline as the hub: backup first, promote only verified commits, then prove the gateway is alive.',
    ],
  },
  {
    id: 'nestor',
    name: 'Nestor',
    role: 'Strategic commander · MacBook',
    x: 846,
    y: 522,
    r: 44,
    accent: 'amber',
    icon: 'laptop',
    facts: ['Lives on the MacBook', 'Online when mobile', 'Big-picture thinking', 'Nestor gateway verified'],
    body: [
      'Nestor rides along on the MacBook, so it appears in the constellation whenever Benjamin is out and about with the laptop open.',
      'Where Magnus coordinates, Nestor commands: it is the strategic voice for planning, reviewing, and steering bigger projects — and it hands work back to Magnus when the lid closes.',
      'The laptop is now treated as a first-class Hermes node: updated over the private mesh, gateway-checked, and connected to Home Assistant through the same MagicDNS route.',
    ],
  },
  {
    id: 'obsidian',
    name: 'Obsidian Vault',
    role: 'The memory garden',
    x: 300,
    y: 556,
    r: 42,
    accent: 'rose',
    icon: 'vault',
    facts: ['Notes & long-term memory', 'Sanitized graph preview', 'Readable by every agent'],
    body: [
      'The Obsidian vault is the library of the constellation — a garden of interlinked notes where ideas, decisions, and context are planted and tended.',
      'Agents read it to remember what matters and write back what they learn, so the system gets more personal and more useful the longer it runs.',
    ],
  },
  {
    id: 'homeassistant',
    name: 'Home Assistant',
    role: 'The smart-home bridge',
    x: 640,
    y: 592,
    r: 42,
    accent: 'amber',
    icon: 'house',
    facts: ['Lights, sensors, scenes', 'Tailscale / MagicDNS', 'Verified from agents'],
    body: [
      'Home Assistant is the bridge between the digital constellation and the physical house — lights, sensors, heating, scenes.',
      'It is reachable only over the private network, never the open internet, so "turn the studio lights warm" travels safely from a Telegram message to an actual bulb.',
      'The estate update now checks Home Assistant as part of system health, preferring the private MagicDNS route instead of brittle local hostnames.',
    ],
  },
  {
    id: 'web',
    name: 'The Open Web',
    role: 'The outside world',
    x: 500,
    y: 78,
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
    role: 'Accountable builder · software engineer',
    x: 0,
    y: 0,
    r: 20,
    accent: 'green',
    icon: 'wrench',
    satellite: true,
    facts: ['On standby aboard Magnus', 'Owns hands-on builds', 'AI Worker + OrcaForge', 'Verifies before shipping'],
    body: [
      'Boris is the accountable builder: the practical AI software engineer Magnus wakes when something needs to be designed, fixed, tested, or shipped.',
      'AI Worker and OrcaForge orbit Boris as build skills rather than separate bosses. Boris decides the engineering plan, delegates scoped work to the right lane, verifies the result, and reports back through Magnus.',
      'Boris also maintains the operating system itself: weekly estate updates, cron ownership checks, skill/tool/MCP parity audits, and public deployment verification.',
    ],
  },
  {
    id: 'aiworker',
    name: 'AI Worker',
    role: 'Boris skill · background execution',
    x: 0,
    y: 0,
    r: 15,
    accent: 'green',
    icon: 'terminal',
    satellite: true,
    facts: ['Linked to Boris', 'Runs scoped jobs', 'Mission control layer', 'Reports to the builder'],
    body: [
      'AI Worker is Boris’s background workbench: a reusable skill for delegated scripts, checks, builds, data pulls, and repeatable execution loops.',
      'It gives the system safe parallel hands without losing accountability. AI Worker executes a bounded work order; Boris owns the judgment and the handoff.',
      'The important shift is visibility: work becomes a mission with a brief, logs, checks, and a result rather than a vague background promise.',
    ],
  },
  {
    id: 'orcaforge',
    name: 'OrcaForge',
    role: 'Boris skill · multi-agent software forge',
    x: 0,
    y: 0,
    r: 15,
    accent: 'cyan',
    icon: 'forge',
    satellite: true,
    facts: ['Linked to Boris', 'GPT-5.6 Sol lead lane', 'Separate Sol review', 'Audit trail + deploy gate'],
    body: [
      'OrcaForge is Boris’s high-power coding cockpit: mission brief, isolated worktrees, GPT-5.6 Sol implementation, bounded agent-swarm subtasks where useful, a separate Sol review pass, and independent Boris verification.',
      'It is how an idea becomes a working artifact with an audit trail — not just a model claiming it is done.',
      'Other models are capability-gated exceptions, not an automatic chain. Recent launches use the forge as the disciplined path from request to local proof, deployment gate, live smoke test, and rollback-aware handover.',
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
  {
    id: 'harvey',
    name: 'Harvey',
    role: 'Standby specialist · UK legal counsel',
    x: 0,
    y: 0,
    r: 20,
    accent: 'amber',
    icon: 'shield',
    satellite: true,
    facts: ['On the Mac Pro', 'UK legal strategy', 'Contracts, AI law, business, property', 'Weekly AI-law watch'],
    body: [
      'Harvey is the legal strategist: a private Mac Pro specialist for UK legal research, contract review, terms, AI law, business law, property questions, employment issues, and negotiation posture.',
      'He is designed to be confident and commercially minded without pretending to replace a solicitor: Harvey can draft, analyse, map risk, and recommend a move, while high-stakes external action remains approval-gated.',
      'A weekly watch keeps an eye on UK agentic-AI legal developments from government, regulators, courts, professional bodies, and credible secondary sources.',
    ],
  },
  {
    id: 'surgeons',
    name: 'Surgeons’ Assistant',
    role: 'Clinical decision assistant · future Magnus specialist',
    x: 0,
    y: 0,
    r: 20,
    accent: 'cyan',
    icon: 'shield',
    satellite: true,
    facts: ['Currently associated with Nestor', 'Shown with Magnus as future home', 'Decision-support only'],
    body: [
      'Surgeons’ Assistant is the careful clinical decision-support helper: structured questions, differential thinking, guideline-aware summaries, and safety caveats.',
      'It is shown orbiting Magnus because that is the intended operational future — a clinical specialist on the always-on hub, not just on Nestor’s MacBook.',
    ],
  },
  {
    id: 'aegis',
    name: 'Aegis',
    role: 'Personal health coach · future Magnus specialist',
    x: 0,
    y: 0,
    r: 20,
    accent: 'green',
    icon: 'heart',
    satellite: true,
    facts: ['Currently associated with Nestor', 'Shown with Magnus as future home', 'Personal health coaching'],
    body: [
      'Aegis is the personal health coach: habits, wellbeing, routines, and gentle accountability rather than emergency medicine.',
      'Like Surgeons’ Assistant, it is displayed with Magnus to preview the planned migration into the always-on agent constellation.',
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
  { id: 'tg-mag', from: 'telegram', to: 'magnus', path: 'M 150 350 C 252 244 396 248 500 350' },
  { id: 'mag-web', from: 'magnus', to: 'web', path: 'M 500 350 C 450 246 456 142 500 78' },
  { id: 'mag-apollo', from: 'magnus', to: 'apollo', path: 'M 500 350 C 610 176 734 134 846 182', tailscale: true },
  { id: 'mag-nestor', from: 'magnus', to: 'nestor', path: 'M 500 350 C 626 540 734 600 846 522', tailscale: true },
  { id: 'mag-obsidian', from: 'magnus', to: 'obsidian', path: 'M 500 350 C 408 430 374 530 300 556' },
  { id: 'mag-ha', from: 'magnus', to: 'homeassistant', path: 'M 500 350 C 564 434 610 524 640 592' },
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
    path: 'M 150 350 C 252 244 396 248 500 350',
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
    path: 'M 500 350 C 450 246 456 142 500 78',
    highlight: ['magnus', 'web'],
    edgeId: 'mag-web',
  },
  {
    caption: 'The vault remembers',
    detail: 'Obsidian notes recall preferences: no early starts, loves coastal walks.',
    path: 'M 500 350 C 408 430 374 530 300 556',
    highlight: ['magnus', 'obsidian'],
    edgeId: 'mag-obsidian',
  },
  {
    caption: 'Apollo takes the heavy load',
    detail: 'The deep itinerary research is delegated over the secure Tailscale tunnel.',
    path: 'M 500 350 C 610 176 734 134 846 182',
    highlight: ['magnus', 'apollo'],
    edgeId: 'mag-apollo',
  },
  {
    caption: 'The house responds',
    detail: 'Home Assistant nudges the studio heating — privately, on the home network.',
    path: 'M 500 350 C 564 434 610 524 640 592',
    highlight: ['magnus', 'homeassistant'],
    edgeId: 'mag-ha',
  },
  {
    caption: 'The answer flies home',
    detail: 'Magnus assembles everything into one tidy reply back to Telegram.',
    path: 'M 500 350 C 396 248 252 244 150 350',
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
  { name: 'Scheduler', blurb: 'Runs routines on time, with cron ownership so jobs do not duplicate across agents.', icon: 'clock' },
  { name: 'Messages', blurb: 'Sends results and check-ins back through Telegram.', icon: 'chat' },
]

export interface SkillCard {
  name: string
  blurb: string
}

export interface UpgradeCard {
  name: string
  eyebrow: string
  blurb: string
  proof: string
  accent: Accent
}

export const UPGRADES: UpgradeCard[] = [
  {
    name: 'Weekly full-system update',
    eyebrow: 'Estate maintenance',
    blurb: 'A scheduled overnight process keeps the Hermes estate current: backup, preserve local upgrades, promote verified commits, migrate config, restart gateways, and report rollback paths.',
    proof: 'i7, Apollo, Nestor and Home Assistant checked as one operating estate',
    accent: 'cyan',
  },
  {
    name: 'AI Worker mission control',
    eyebrow: 'Background execution',
    blurb: 'Long-running work becomes a visible mission instead of disappearing into the background: brief, logs, status, and a final result Boris can verify.',
    proof: 'Scoped worker lanes with auditable handoff',
    accent: 'green',
  },
  {
    name: 'OrcaForge build cockpit',
    eyebrow: 'Multi-agent engineering',
    blurb: 'Serious builds now move through a disciplined forge: mission brief, isolated worktrees, GPT-5.6 Sol implementation and review, browser smoke tests, and Boris sign-off.',
    proof: 'From Telegram request to deployed public app with evidence',
    accent: 'amber',
  },
  {
    name: 'Cross-machine parity audit',
    eyebrow: 'Drift control',
    blurb: 'Skills, toolsets, MCPs, providers, cron jobs, platform adapters, and key commands are compared across machines so useful upgrades do not stay trapped on one node.',
    proof: 'Cron jobs are audited as single-owner resources to avoid duplicates',
    accent: 'rose',
  },
  {
    name: 'Home Assistant on the private mesh',
    eyebrow: 'Physical-world bridge',
    blurb: 'Home Assistant is now treated as a first-class endpoint: checked over Tailscale/MagicDNS from relevant agents and corrected when brittle local names fail.',
    proof: 'Private route verified before the agents rely on it',
    accent: 'ice',
  },
  {
    name: 'New specialist agents',
    eyebrow: 'Expanding crew',
    blurb: 'The constellation now has clearer roles for Boris, Nestor, Apollo, Sterling, The Professor, Harvey, Aegis, and Surgeon’s Assistant — each with explicit accountability and safe boundaries.',
    proof: 'More agents, clearer handoffs, less chaos',
    accent: 'green',
  },
]

export const SKILLS: SkillCard[] = [
  { name: 'Morning Briefing', blurb: 'Weather, calendar, and overnight news, distilled before breakfast.' },
  { name: 'Deep Research', blurb: 'Fan out across many sources, cross-check, return one trustworthy answer.' },
  { name: 'Vault Gardening', blurb: 'Tidy, link, and grow the Obsidian knowledge garden.' },
  { name: 'Home Routines', blurb: 'Orchestrate lights, heating, and scenes around real life.' },
  { name: 'Build & Ship', blurb: 'Take a software idea from sketch to working, tested code.' },
  { name: 'Full System Update', blurb: 'Weekly overnight estate maintenance: backups, safe updates, gateway restarts, parity audits, and rollback notes.' },
  { name: 'AI Worker', blurb: 'Boris’s background workbench for scoped scripts, checks, builds, and repeatable execution loops.' },
  { name: 'OrcaForge', blurb: 'Boris’s multi-agent software forge: visible worktrees, GPT-5.6 Sol implementation and review, and verified handoff.' },
  { name: 'Inbox Triage', blurb: 'Sort the important from the ignorable and draft the replies.' },
  { name: 'Watchkeeper', blurb: 'Monitor pages and feeds; speak up only when something truly changes.' },
  { name: 'Trip Planner', blurb: 'Turn "somewhere nice this weekend?" into a full itinerary.' },
]

export type WorkflowCategory = 'personal' | 'software' | 'research' | 'legal' | 'other'

export interface WorkflowCard {
  id: string
  title: string
  command: string
  category: WorkflowCategory
  owner: string
  summary: string
  detail: string
  steps: string[]
  accent: Accent
}

export const WORKFLOW_CATEGORIES: Array<{ id: WorkflowCategory; label: string; blurb: string }> = [
  { id: 'personal', label: 'Personal assistant', blurb: 'Brief, remember, triage, and prepare the day without taking external action.' },
  { id: 'software', label: 'Software development', blurb: 'Turn product ideas into verified code, deployments, and operating-system maintenance.' },
  { id: 'research', label: 'Research', blurb: 'Source-backed discovery, synthesis, and argument mapping for serious questions.' },
  { id: 'legal', label: 'Legal', blurb: 'UK legal research, drafting, risk mapping, and AI-law monitoring with external action approval-gated.' },
  { id: 'other', label: 'Others', blurb: 'Watchdogs, health checks, and cross-system routines that keep the estate reliable.' },
]

export const WORKFLOWS: WorkflowCard[] = [
  {
    id: 'morning-briefing',
    title: 'Morning Briefing',
    command: 'scheduled workflow',
    category: 'personal',
    owner: 'Magnus / Nestor',
    summary: 'A concise start-of-day briefing for weather, calendar, priorities, and overnight signals.',
    detail: 'Designed as a personal-assistant loop: gather context, filter noise, and return a useful plan without sending messages or changing systems on its own.',
    steps: ['Collect signals', 'Filter relevance', 'Draft brief', 'Send to Benjamin'],
    accent: 'ice',
  },
  {
    id: 'diary-context',
    title: 'Diary & recent context',
    command: 'scheduled workflow',
    category: 'personal',
    owner: 'Nestor / Obsidian',
    summary: 'Keeps a rolling memory of recent work so agents start with context instead of asking Benjamin to repeat himself.',
    detail: 'Nightly and weekly Obsidian consolidation turns session traces into safer, higher-signal memory notes while keeping raw task state out of permanent memory.',
    steps: ['Read recent activity', 'Extract stable context', 'Write digest', 'Flag review items'],
    accent: 'rose',
  },
  {
    id: 'executive-triage',
    title: 'Executive triage',
    command: 'assistant workflow',
    category: 'personal',
    owner: 'Nestor / Sterling',
    summary: 'Sorts tasks, drafts replies, and prepares decisions while keeping external sends approval-gated.',
    detail: 'This is the chief-of-staff pattern: make the next action clear, produce draft text when useful, and leave anything public or consequential for human approval.',
    steps: ['Capture inbox', 'Classify urgency', 'Draft next action', 'Ask for approval'],
    accent: 'amber',
  },
  {
    id: 'ai-worker',
    title: 'AI Worker',
    command: '/ai_worker',
    category: 'software',
    owner: 'Boris',
    summary: 'Runs bounded background missions with a brief, logs, status, and a final result Boris can verify.',
    detail: 'AI Worker is for scoped execution that should not disappear into a black box: scripts, checks, data pulls, builds, and repeatable loops with an auditable handoff.',
    steps: ['Write mission brief', 'Run worker lane', 'Collect logs', 'Verify result'],
    accent: 'green',
  },
  {
    id: 'orca-forge',
    title: 'OrcaForge',
    command: '/orca_forge',
    category: 'software',
    owner: 'Boris',
    summary: 'The high-power software forge: visible Orca cockpit, GPT-5.6 Sol implementation and review, Boris verification.',
    detail: 'Used for serious builds where Benjamin should be able to watch the engineering cockpit, capability-based model exceptions must be justified, and push, deploy, migration, or paid-model gates stay explicit.',
    steps: ['Mission brief', 'Visible builder lane', 'Adversarial review', 'Verify & deploy gate'],
    accent: 'cyan',
  },
  {
    id: 'orca-forge-async',
    title: 'OrcaForge Async',
    command: '/orca_forge_async',
    category: 'software',
    owner: 'Boris',
    summary: 'Launches the same OrcaForge playbook in a separate background mission so Telegram stays free.',
    detail: 'This is a thin launcher, not a second forge. It writes a context handoff, starts a fresh Boris worker with the current OrcaForge skill loaded, then reports only completion, blockers, failures, or timeout.',
    steps: ['Capture context', 'Start async worker', 'Run OrcaForge', 'Report final/blocker'],
    accent: 'green',
  },
  {
    id: 'full-system-update',
    title: 'Full System Update',
    command: '/full_system_update',
    category: 'software',
    owner: 'Boris / Magnus',
    summary: 'A safe maintenance workflow for the Hermes estate: backups, updates, tests, gateway checks, and rollback notes.',
    detail: 'This is the weekly operating-system hardening loop. It updates deliberately, preserves local work, verifies gateways and key integrations, then reports evidence.',
    steps: ['Backup', 'Update', 'Test gateways', 'Report rollback'],
    accent: 'amber',
  },
  {
    id: 'creative-designer',
    title: 'Creative Designer',
    command: '/creative_designer',
    category: 'software',
    owner: 'Boris',
    summary: 'A reusable visual-design workflow: turn a brief and references into several concepts, then production-ready artwork.',
    detail: 'Boris’s design lane for diagrams, graphics, and interface mockups. It captures the visual brief and references, explores multiple concepts, runs critique loops, and draws on a likes/dislikes reference library plus Figma and context integration before producing the final.',
    steps: ['Capture brief & references', 'Explore concepts', 'Critique loop', 'Produce final'],
    accent: 'rose',
  },
  {
    id: 'research',
    title: 'Research',
    command: '/research',
    category: 'research',
    owner: 'The Professor',
    summary: 'Source-backed research and synthesis for questions that deserve more than a quick answer.',
    detail: 'The research workflow gathers sources, checks claims, preserves traceability, and returns a structured synthesis rather than a loose web summary.',
    steps: ['Frame question', 'Gather sources', 'Check evidence', 'Synthesize answer'],
    accent: 'rose',
  },
  {
    id: 'storm',
    title: 'STORM',
    command: '/storm',
    category: 'research',
    owner: 'The Professor',
    summary: 'A multi-perspective exploration workflow for outlines, arguments, and viewpoints before final writing.',
    detail: 'STORM is useful when the answer benefits from structured debate: build perspectives, map disagreements, and turn them into a stronger outline.',
    steps: ['Generate perspectives', 'Debate angles', 'Map outline', 'Prepare synthesis'],
    accent: 'ice',
  },
  {
    id: 'research-storm',
    title: 'Research STORM',
    command: '/research_storm',
    category: 'research',
    owner: 'The Professor',
    summary: 'A thin orchestration that runs Research and then STORM in sequence for richer evidence-backed synthesis.',
    detail: 'First it establishes the source base; then it stress-tests the topic through STORM-style perspectives before producing an organised final view.',
    steps: ['Run research', 'Extract claims', 'Run STORM', 'Merge synthesis'],
    accent: 'cyan',
  },
  {
    id: 'legal-counsel',
    title: 'Legal Counsel',
    command: 'Harvey / legal workflow',
    category: 'legal',
    owner: 'Harvey',
    summary: 'UK-focused legal issue-spotting, drafting, contract review, negotiation strategy, and source-backed legal research.',
    detail: 'Harvey starts with the bottom line, identifies the legal and commercial levers, maps practical options, drafts wording where useful, and flags when Benjamin should instruct a qualified solicitor before acting.',
    steps: ['Frame issue', 'Check sources', 'Map options', 'Draft or recommend'],
    accent: 'amber',
  },
  {
    id: 'agentic-ai-law-watch',
    title: 'Agentic AI Legal Watch',
    command: 'weekly scheduled workflow',
    category: 'legal',
    owner: 'Harvey',
    summary: 'A weekly UK watch for legal developments relating to agentic AI, legal tech, regulators, cases, and guidance.',
    detail: 'Harvey checks primary UK sources first — government, regulators, professional bodies, legislation, courts — then uses credible secondary analysis for context before sending Benjamin a concise action-focused summary.',
    steps: ['Scan authorities', 'Filter material changes', 'Summarise impact', 'Recommend action'],
    accent: 'rose',
  },
  {
    id: 'watchkeeper',
    title: 'Watchkeeper',
    command: 'scheduled workflow',
    category: 'other',
    owner: 'Magnus',
    summary: 'Monitors pages, services, or feeds and speaks up only when something meaningful changes.',
    detail: 'Watchkeeper-style jobs reduce noise: they poll quietly, compare against expected state, and alert Benjamin only when a change or failure matters.',
    steps: ['Poll target', 'Compare state', 'Judge meaning', 'Alert if needed'],
    accent: 'green',
  },
  {
    id: 'integration-watchdog',
    title: 'Integration health watchdog',
    command: 'scheduled workflow',
    category: 'other',
    owner: 'Magnus',
    summary: 'Checks key integrations periodically and alerts only when a connection needs attention.',
    detail: 'A small reliability loop for the integrations layer: stay silent while healthy, report actionable failures before they break larger workflows.',
    steps: ['Check integration health', 'Confirm expected access', 'Stay quiet', 'Alert on failure'],
    accent: 'amber',
  },
  {
    id: 'dashboard-watchdog',
    title: 'Dashboard watchdog',
    command: 'scheduled workflow',
    category: 'other',
    owner: 'Boris',
    summary: 'Checks the departmental research dashboard on a schedule so service failures are caught early.',
    detail: 'A practical production-ops loop: probe the app, keep routine success silent, and send an alert with enough context to fix a real outage.',
    steps: ['Probe app', 'Check response', 'Stay silent on success', 'Alert on outage'],
    accent: 'ice',
  },
]

export interface ModelCartridge {
  name: string
  maker: string
  vibe: string
  accent: Accent
}

export const MODELS: ModelCartridge[] = [
  { name: 'GPT-5.6 Sol', maker: 'OpenAI', vibe: 'Preferred planning, implementation, and review engine', accent: 'cyan' },
  { name: 'Grok 4.5', maker: 'xAI', vibe: 'Role-specific specialist and fast alternate lane', accent: 'amber' },
  { name: 'GLM-5.2', maker: 'Ollama Cloud', vibe: 'Estate fallback for resilient operation', accent: 'green' },
  { name: 'DeepSeek V4 Flash', maker: 'Ollama Cloud', vibe: 'Private laptop specialist routing', accent: 'rose' },
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
      'The calm centre of the constellation. Reads every request, makes the plan, picks the right helper, keeps the canonical record, and now oversees weekly estate health. Lives on the always-on Mac mini.',
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
      'The big-picture commander who travels with the MacBook. Steers long projects, reviews plans, challenges assumptions, and now runs as a verified Hermes node on the same private mesh.',
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
      'The tireless second pair of hands on its own Mac mini. Takes long, heavy jobs — big research, builds, batch work, and remote agent lanes — while staying aligned to the same verified Hermes commit set.',
    traits: ['Tireless', 'Heavy lifting', 'Parallel lanes'],
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
      'Blunt, practical, allergic to waffle. Summoned when something needs to be built, fixed, shipped, or operationally hardened; can invoke AI Worker and OrcaForge but remains accountable for the result.',
    traits: ['No-nonsense', 'Hands-on', 'Verified shipping'],
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
    id: 'harvey',
    name: 'Harvey',
    title: 'The Legal Strategist',
    status: 'remote',
    statusLabel: 'Mac Pro · Telegram',
    accent: 'amber',
    icon: 'shield',
    description:
      'A confident UK legal specialist for contracts, terms, AI law, business law, property, employment, and regulatory questions. Commercially aggressive where useful, but source-backed and approval-gated for real-world legal action.',
    traits: ['Strategic', 'Concise', 'UK legal focus'],
  },
  {
    id: 'surgeons',
    name: 'Surgeons’ Assistant',
    title: 'Clinical Decision Assistant',
    status: 'standby',
    statusLabel: 'Moving to Magnus',
    accent: 'cyan',
    icon: 'shield',
    description:
      'A careful clinical support specialist for structured thinking, safety checks, guideline-aware summaries, and decision-support-only caveats. Currently Nestor-associated; shown here in its planned Magnus home.',
    traits: ['Clinical safety', 'Structured thinking', 'Decision-support only'],
  },
  {
    id: 'aegis',
    name: 'Aegis',
    title: 'Personal Health Coach',
    status: 'standby',
    statusLabel: 'Moving to Magnus',
    accent: 'green',
    icon: 'heart',
    description:
      'A personal health and wellbeing coach for routines, habits, recovery, and gentle accountability. Currently Nestor-associated; shown here in its planned Magnus home.',
    traits: ['Wellbeing', 'Habits', 'Accountability'],
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
      'The constellation is built to grow. New machines, specialists, MCP servers, and skills can join — but the parity audit keeps growth deliberate rather than chaotic.',
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
    text: 'A model is slotted in like an engine cartridge: GPT-5.6 Sol leads planning, building, and review; Grok or local fallbacks are selected only for a role-specific capability or availability need.',
    icon: 'cartridge',
    accent: 'amber',
  },
  {
    num: '04',
    title: 'Boris can forge the build',
    text: 'For engineering, Magnus wakes Boris. Boris can invoke AI Worker for bounded background jobs or OrcaForge for the full Sol-led build, adversarial review, and verified-deploy pipeline.',
    icon: 'wrench',
    accent: 'green',
  },
  {
    num: '05',
    title: 'Memory and home join in',
    text: 'Work can spread across the three-computer mesh: Magnus coordinates, Apollo takes heavy lanes, Nestor steers strategy, Obsidian supplies context, and Home Assistant is checked over Tailscale before agents rely on it.',
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

/* ---------- Loop registry ----------
   The recurring operating loops, described at product level: what runs, how
   often, who owns it, where the result lands, and what it may never do.
   Descriptive only — no schedules-as-configuration, credentials, or payloads. */

export type LoopStatus = 'running' | 'scheduled' | 'planned'

export interface LoopEntry {
  id: string
  name: string
  cadence: string
  owner: string
  surface: string
  status: LoopStatus
  statusLabel: string
  summary: string
  guardrail: string
  accent: Accent
}

export const LOOPS: LoopEntry[] = [
  {
    id: 'morning-briefing',
    name: 'Morning Briefing',
    cadence: 'Daily · before breakfast',
    owner: 'Magnus / Nestor',
    surface: 'Telegram',
    status: 'running',
    statusLabel: 'Running',
    summary: 'Gathers weather, calendar, and overnight signals, filters the noise, and returns one short plan for the day.',
    guardrail: 'Reads and summarises only — never sends messages or moves appointments on Benjamin’s behalf.',
    accent: 'ice',
  },
  {
    id: 'diary-context',
    name: 'Diary & recent context',
    cadence: 'Daily',
    owner: 'Nestor / Obsidian',
    surface: 'Obsidian vault',
    status: 'running',
    statusLabel: 'Running',
    summary: 'Threads the last few days of notes and decisions into the vault so the next conversation starts with memory.',
    guardrail: 'Stays on Benjamin’s own hardware. Nothing leaves the private mesh.',
    accent: 'green',
  },
  {
    id: 'integration-watchdog',
    name: 'Integration health watchdog',
    cadence: 'Hourly',
    owner: 'Magnus',
    surface: 'Telegram — only on failure',
    status: 'running',
    statusLabel: 'Running',
    summary: 'Probes the integrations layer, stays silent while healthy, and speaks up before a quiet failure breaks a larger workflow.',
    guardrail: 'Alerts only. Restarts and repairs stay behind an explicit human gate.',
    accent: 'amber',
  },
  {
    id: 'dashboard-watchdog',
    name: 'Dashboard watchdog',
    cadence: 'Every quarter hour',
    owner: 'Boris',
    surface: 'Telegram — only on failure',
    status: 'running',
    statusLabel: 'Running',
    summary: 'Checks that the deployed surfaces are actually answering, so an outage is caught long before someone notices it by hand.',
    guardrail: 'Read-only probes against public endpoints. No deploys, no rollbacks.',
    accent: 'cyan',
  },
  {
    id: 'full-system-update',
    name: 'Full System Update',
    cadence: 'Weekly · overnight',
    owner: 'Boris / Magnus',
    surface: 'Telegram evidence report',
    status: 'scheduled',
    statusLabel: 'Scheduled',
    summary: 'The estate-hardening loop: back up, update deliberately, verify gateways and key integrations, then report evidence and rollback notes.',
    guardrail: 'Local work is preserved. Anything irreversible is proposed, not performed.',
    accent: 'rose',
  },
  {
    id: 'agentic-ai-law-watch',
    name: 'Agentic AI Legal Watch',
    cadence: 'Weekly',
    owner: 'Harvey',
    surface: 'Telegram digest',
    status: 'scheduled',
    statusLabel: 'Scheduled',
    summary: 'Tracks UK and EU movement on agentic-AI law and returns a short digest of what changed and what it might mean.',
    guardrail: 'Research and drafting only. No filings, no external correspondence.',
    accent: 'ice',
  },
  {
    id: 'dashboard-digest',
    name: 'Dashboard digest',
    cadence: 'Not yet wired',
    owner: 'Magnus',
    surface: 'Ben’s Dashboards',
    status: 'planned',
    statusLabel: 'Planned',
    summary: 'The loop that will keep the personal dashboards current — folding each surface’s latest state into one glanceable summary.',
    guardrail: 'Will read only sources Benjamin explicitly connects, one surface at a time.',
    accent: 'green',
  },
]

/* ---------- Ben’s Dashboards ----------
   Selection surface only. Every card below is future-facing product framing:
   nothing here reads live data, and no personal, financial, or clinical
   records are present in this showcase. */

export interface DashboardCard {
  id: string
  name: string
  icon: string
  accent: Accent
  statusLabel: string
  blurb: string
  panels: string[]
  architecture?: string
  privacy?: string
  launcherLabel?: string
}

export const DASHBOARDS: DashboardCard[] = [
  {
    id: 'finances',
    name: 'Sterling Finance Cockpit',
    icon: 'vault',
    accent: 'green',
    statusLabel: 'Live in Magnus',
    blurb: 'Authenticated Sterling finance cockpit inside Magnus. The browser talks only to Magnus; server-side proxy routes fetch read-only finance data from the Sterling backend without bundling database credentials or backend tokens.',
    panels: ['Live finance cockpit', 'Read-only server proxy', 'Sterling warehouse'],
    architecture: 'Magnus login → Magnus /api/finance proxy → hidden Sterling backend → local finance warehouse. No Imperial Research hostname is used.',
    privacy: 'Finance data is fetched only after Magnus authentication. Vercel receives the API response for the authenticated session, but never receives database credentials or raw warehouse access.',
    launcherLabel: 'Open Sterling Finance Cockpit',
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: 'globe',
    accent: 'ice',
    statusLabel: 'Planned',
    blurb: 'Trips from idea to itinerary: where to go next, what is already booked, and what still needs a decision.',
    panels: ['Upcoming trips', 'Itinerary drafts', 'Places to return to'],
  },
  {
    id: 'research',
    name: 'Research',
    icon: 'book',
    accent: 'cyan',
    statusLabel: 'Planned',
    blurb: 'The Professor’s output, made durable — open questions, source-backed answers, and the reading queue behind them.',
    panels: ['Open questions', 'Recent syntheses', 'Reading queue'],
  },
  {
    id: 'surgical-training',
    name: 'Surgical training',
    icon: 'heart',
    accent: 'rose',
    statusLabel: 'Planned',
    blurb: 'Progress against the training curriculum: milestones reached, courses ahead, and evidence still to gather.',
    panels: ['Curriculum milestones', 'Courses & exams', 'Portfolio evidence'],
  },
  {
    id: 'coding-projects',
    name: 'Coding projects',
    icon: 'terminal',
    accent: 'amber',
    statusLabel: 'Planned',
    blurb: 'What Boris is building: active repositories, OrcaForge runs in flight, and the health of everything already shipped.',
    panels: ['Active repositories', 'OrcaForge runs', 'Build & deploy health'],
  },
  {
    id: 'todo',
    name: 'General to-do list',
    icon: 'files',
    accent: 'cyan',
    statusLabel: 'Planned',
    blurb: 'Everything captured but not yet done, ordered by what actually matters this week rather than what shouted loudest.',
    panels: ['This week', 'Waiting on someone', 'Someday / maybe'],
  },
]

export const STATS = [
  { label: 'Tools', value: TOOLS.length, hint: 'hands-on capabilities' },
  { label: 'Skills', value: SKILLS.length, hint: 'reusable playbooks' },
  { label: 'Models', value: MODELS.length, hint: 'swappable minds' },
  { label: 'Agents', value: PERSONAS.filter((p) => p.id !== 'future').length, hint: 'named personas' },
] as const
