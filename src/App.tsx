import { useState } from 'react'
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

  return (
    <div className="shell">
      <div className="aurora" aria-hidden="true">
        <span className="aurora-blob a" />
        <span className="aurora-blob b" />
        <span className="aurora-blob c" />
      </div>
      <div className="grain" aria-hidden="true" />

      <header className="masthead">
        <p className="masthead-kicker">A constellation of helpful machines</p>
        <h1 className="masthead-title">
          Magnus <span className="title-amp">/</span> Hermes
        </h1>
        <p className="masthead-sub">
          Three Macs, one private network, a crew of AI personas — Benjamin&apos;s personal mission control, run
          entirely from a chat window.
        </p>
        <div className="stat-row">
          {STATS.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} hint={s.hint} />
          ))}
        </div>
      </header>

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

      <main className="stage">
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
          Hermes Agent · a private constellation on Benjamin&apos;s own hardware · no clouds were harmed in the making
          of this network
        </p>
      </footer>
    </div>
  )
}
