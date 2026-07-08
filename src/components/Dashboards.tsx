/* Ben's Dashboards — the selection surface reached from the Magnus hero CTA.
   Every card is future-facing product framing: nothing here reads live data,
   and no personal, financial, or clinical records are present. */

import { DASHBOARDS } from '../data'
import { Icon } from './Icon'

export function Dashboards({ onBack }: { onBack: () => void }) {
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
              </article>
            ))}
          </div>

          <aside className="privacy-card">
            <span className="privacy-icon">
              <Icon name="shield" size={24} />
            </span>
            <div>
              <h3>Nothing is connected yet</h3>
              <p>
                These are design surfaces, not live readouts. No account, ledger, calendar, repository, or clinical
                record is wired to this page. Each dashboard will only ever read the sources Benjamin explicitly
                connects, one at a time, on the same private hardware as the rest of the constellation.
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
