/* Ben's Dashboards — the selection surface reached from the Magnus hero CTA.
   Every card is future-facing product framing: nothing here reads live data,
   and no personal, financial, or clinical records are present. */

import { DASHBOARDS } from '../data'
import { Icon } from './Icon'

export function Dashboards({ onBack, onOpenFinance }: { onBack: () => void; onOpenFinance: () => void }) {
  return (
    <div className="shell">
      <header className="global-nav">
        <div className="global-nav-inner">
          <button type="button" className="brand" onClick={onBack}>
            Magnus <span className="brand-slash">/</span> Dashboards
          </button>
          <nav className="global-nav-links" aria-label="Dashboards">
            <button type="button" className="global-nav-link" onClick={onBack}>
              ‹ Back to showcase
            </button>
          </nav>
        </div>
      </header>

      <section className="hero dashboards-hero">
        <p className="hero-kicker">Ben’s Dashboards</p>
        <h1 className="hero-title">Pick a corner of the estate</h1>
        <p className="hero-sub">
          Six personal surfaces, each one a different question Benjamin asks the system regularly. Choose a dashboard
          to see what it is being designed to answer.
        </p>
      </section>

      <main className="stage">
        <div className="tab-pane">
          <div className="dashboard-grid">
            {DASHBOARDS.map((d, i) => (
              <article
                className={`dashboard-card accent-${d.accent} rise`}
                key={d.id}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="dashboard-card-top">
                  <span className="dashboard-icon">
                    <Icon name={d.icon} size={24} />
                  </span>
                  <span className="dashboard-status">{d.statusLabel}</span>
                </div>
                <h3>{d.name}</h3>
                <p className="dashboard-blurb">{d.blurb}</p>
                <ul className="dashboard-panels" aria-label={`${d.name} planned panels`}>
                  {d.panels.map((panel) => (
                    <li key={panel}>{panel}</li>
                  ))}
                </ul>
                {d.architecture && (
                  <div className="dashboard-architecture" aria-label={`${d.name} architecture`}>
                    <strong>Architecture</strong>
                    <p>{d.architecture}</p>
                    {d.id === 'finances' ? (
                      <button type="button" className="dashboard-launcher-link" onClick={onOpenFinance}>
                        {d.launcherLabel ?? 'Open private surface'}
                      </button>
                    ) : (
                      <span>{d.launcherLabel ?? 'Open private surface'}</span>
                    )}
                  </div>
                )}
                {d.privacy && <p className="dashboard-privacy-note">{d.privacy}</p>}
              </article>
            ))}
          </div>

          <aside className="privacy-card">
            <span className="privacy-icon">
              <Icon name="shield" size={24} />
            </span>
            <div>
              <h3>Public shell, private cockpit</h3>
              <p>
                The Sterling Finance Cockpit is now a local-private read-only dashboard backed by Sterling’s trusted
                finance warehouse. This public Magnus surface is deliberately limited to safe architecture, launcher,
                and status language: no balances, transactions, merchants, subscriptions, liabilities, evidence rows,
                credentials, or raw finance identifiers are present here.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="footer">
        <p>Ben’s Dashboards · design preview · no live data</p>
      </footer>
    </div>
  )
}
