import { useRef, useState } from 'react'
import './App.css'
import { NetworkMap } from './components/NetworkMap'
import { Capabilities, DetailPanel, Journey, Personas, StatCard } from './components/Panels'
import { STATS } from './data'
import type { NodeId } from './data'

type Tab = 'network' | 'capabilities' | 'personas' | 'journey'

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'network', label: 'Network' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'personas', label: 'Personas' },
  { id: 'journey', label: 'Journey' },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('network')
  const [selected, setSelected] = useState<NodeId>('magnus')
  const stageRef = useRef<HTMLElement>(null)

  const goTo = (t: Tab) => {
    setTab(t)
    stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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
        <p className="hero-kicker">A constellation of helpful machines</p>
        <h1 className="hero-title">
          Magnus - multiagentic AI System
        </h1>
        <p className="hero-sub">
          Three Macs, one private network, a crew of AI personas — Benjamin&apos;s personal mission control, run
          entirely from a chat window.
        </p>
        <div className="hero-ctas">
          <button type="button" className="cta-pill primary" onClick={() => goTo('network')}>
            Explore the network
          </button>
          <button type="button" className="cta-pill secondary" onClick={() => goTo('personas')}>
            Meet the crew
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
        {tab === 'journey' && (
          <section id="panel-journey" role="tabpanel" aria-labelledby="tab-journey">
            <Journey />
          </section>
        )}
      </main>

      <footer className="footer">
        <p>
          Magnus · a private constellation on Benjamin&apos;s own hardware · no clouds were harmed in the making
          of this network
        </p>
      </footer>
    </div>
  )
}
