import { useRef, useState } from 'react'
import './App.css'
import { Dashboards } from './components/Dashboards'
import { FinanceCockpit } from './components/FinanceCockpit'
import { NetworkMap } from './components/NetworkMap'
import { Capabilities, DetailPanel, Journey, LoopRegistry, Personas, StatCard, Workflows } from './components/Panels'
import { STATS } from './data'
import type { NodeId } from './data'

type Tab = 'network' | 'capabilities' | 'personas' | 'workflows' | 'loops' | 'journey'

/* The showcase and the dashboard selector are sibling views of the Magnus
   surface. Portal keeps rendering <App /> and its dock, so the launcher and
   lock controls stay reachable from either view. */
type View = 'showcase' | 'dashboards' | 'finance'

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'network', label: 'Network' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'personas', label: 'Personas' },
  { id: 'workflows', label: 'Workflows' },
  { id: 'loops', label: 'Loop Registry' },
  { id: 'journey', label: 'Journey' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('network')
  const [view, setView] = useState<View>('showcase')
  const [selected, setSelected] = useState<NodeId>('magnus')
  const stageRef = useRef<HTMLElement>(null)

  const goTo = (t: Tab) => {
    setTab(t)
    stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (view === 'dashboards') return <Dashboards onBack={() => setView('showcase')} onOpenFinance={() => setView('finance')} />
  if (view === 'finance') return <FinanceCockpit onBack={() => setView('dashboards')} />

  return (
    <div className="shell">
      <header className="global-nav">
        <div className="global-nav-inner">
          <button type="button" className="brand" onClick={() => goTo('network')}>
            Magnus
          </button>
          <nav className="global-nav-links" aria-label="Sections">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`global-nav-link ${tab === t.id ? 'current' : ''}`}
                aria-current={tab === t.id ? 'true' : undefined}
                onClick={() => goTo(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <section className="hero">
        <p className="hero-kicker">A stronger multi-agent operating system</p>
        <h1 className="hero-title">
          Magnus — private AI mission control, now with an operations layer
        </h1>
        <p className="hero-sub">
          A private AI constellation across the Mac estate and Home Assistant: Magnus coordinates, specialists execute,
          Boris forges builds, weekly maintenance keeps the estate current, and every result comes back through one
          accountable Telegram hub.
        </p>
        <div className="hero-ctas">
          <button type="button" className="cta-pill primary" onClick={() => goTo('network')}>
            Explore the network
          </button>
          <button type="button" className="cta-pill secondary" onClick={() => goTo('personas')}>
            See what changed
          </button>
          <button type="button" className="cta-pill tertiary" onClick={() => setView('dashboards')}>
            Ben’s Dashboards
          </button>
        </div>
        <div className="stat-row">
          {STATS.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} hint={s.hint} />
          ))}
        </div>
      </section>

      <nav className="tab-bar" role="tablist" aria-label="Showcase sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="stage" ref={stageRef}>
        {tab === 'network' && (
          <section id="panel-network" role="tabpanel" aria-labelledby="tab-network" className="network-layout">
            <NetworkMap selected={selected} onSelect={setSelected} />
            <DetailPanel selected={selected} />
          </section>
        )}
        {tab === 'capabilities' && (
          <section id="panel-capabilities" role="tabpanel" aria-labelledby="tab-capabilities">
            <Capabilities />
          </section>
        )}
        {tab === 'personas' && (
          <section id="panel-personas" role="tabpanel" aria-labelledby="tab-personas">
            <Personas />
          </section>
        )}
        {tab === 'workflows' && (
          <section id="panel-workflows" role="tabpanel" aria-labelledby="tab-workflows">
            <Workflows />
          </section>
        )}
        {tab === 'loops' && (
          <section id="panel-loops" role="tabpanel" aria-labelledby="tab-loops">
            <LoopRegistry />
          </section>
        )}
        {tab === 'journey' && (
          <section id="panel-journey" role="tabpanel" aria-labelledby="tab-journey">
            <Journey />
          </section>
        )}
      </main>

      <footer className="footer">
        <p>
          Magnus · local hardware, private mesh, model-agnostic intelligence · public access limited to Telegram
        </p>
      </footer>
    </div>
  )
}
