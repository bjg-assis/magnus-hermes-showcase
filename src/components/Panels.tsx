import { useEffect, useRef, useState } from 'react'
import { JOURNEY, MODELS, NODES, PERSONAS, SKILLS, TOOLS, UPGRADES } from '../data'
import type { NodeId } from '../data'
import { Icon } from './Icon'

/* ---------- Node detail panel (Network tab) ---------- */

export function DetailPanel({ selected }: { selected: NodeId }) {
  const node = NODES.find((n) => n.id === selected) ?? NODES[1]
  return (
    <aside className={`detail-panel accent-${node.accent}`} aria-live="polite">
      <div className="detail-head">
        <span className="detail-icon">
          <Icon name={node.icon} size={26} />
        </span>
        <div>
          <h3 className="detail-name">{node.name}</h3>
          <p className="detail-role">{node.role}</p>
        </div>
      </div>
      <ul className="detail-facts">
        {node.facts.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      {node.id === 'obsidian' && (
        <figure className="vault-preview">
          <img src="/assets/obsidian-graph.jpg" alt="Screenshot of Benjamin's Obsidian graph view" />
          <figcaption>Sanitized Obsidian graph preview — the memory garden made visible.</figcaption>
        </figure>
      )}
      {node.body.map((p, i) => (
        <p key={i} className="detail-body">
          {p}
        </p>
      ))}
    </aside>
  )
}

/* ---------- Animated count-up stat cards ---------- */

function useCountUp(target: number, duration = 1100) {
  // Start with the real value so screenshots, reduced-motion browsers, and
  // background tabs never show misleading zeroes. When motion is allowed we
  // still replay a quick count-up flourish after hydration.
  const [value, setValue] = useState(target)
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

export function StatCard({ label, value, hint }: { label: string; value: number; hint: string }) {
  const n = useCountUp(value)
  return (
    <div className="stat-card">
      <span className="stat-value">{n}</span>
      <span className="stat-label">{label}</span>
      <span className="stat-hint">{hint}</span>
    </div>
  )
}

/* ---------- Capabilities tab ---------- */

export function Capabilities() {
  return (
    <div className="tab-pane">
      <section className="cap-section system-section">
        <header className="section-head">
          <h2>What makes the constellation different</h2>
          <p>
            It is not one chatbot. It is a private operating system where machines, personas, skills, tools, and
            models are deliberately separate — so each request can use the right combination.
          </p>
        </header>
        <div className="system-grid">
          <article className="system-card rise">
            <span className="system-kicker">Topology</span>
            <h3>Three computers, one mesh</h3>
            <p>Magnus stays always-on, Apollo takes heavy remote lanes, and Nestor travels on the MacBook for strategic sessions.</p>
          </article>
          <article className="system-card rise" style={{ animationDelay: '60ms' }}>
            <span className="system-kicker">Accountability</span>
            <h3>Many agents, one handoff</h3>
            <p>Specialists can be summoned, but Magnus keeps the thread and Boris remains accountable for engineering work.</p>
          </article>
          <article className="system-card rise" style={{ animationDelay: '120ms' }}>
            <span className="system-kicker">Intelligence</span>
            <h3>Model-agnostic by design</h3>
            <p>Claude, GPT/Codex, Grok, OpenRouter, and future models can be routed per task instead of locking the system to one lab.</p>
          </article>
          <article className="system-card rise" style={{ animationDelay: '180ms' }}>
            <span className="system-kicker">Execution</span>
            <h3>Skills turn plans into runs</h3>
            <p>AI Worker, OrcaForge, research, scheduling, vault gardening, and home routines are reusable playbooks agents can invoke.</p>
          </article>
        </div>
        <div className="grammar-card rise" style={{ animationDelay: '240ms' }}>
          <h3>The system grammar</h3>
          <dl>
            <div><dt>Agent</dt><dd>the named role responsible for judgment and tone — Magnus, Boris, Nestor, Sterling.</dd></div>
            <div><dt>Skill</dt><dd>a reusable playbook the agent can run — AI Worker, OrcaForge, Deep Research.</dd></div>
            <div><dt>Tool</dt><dd>a concrete capability — terminal, browser, files, GitHub, Home Assistant.</dd></div>
            <div><dt>Model</dt><dd>the reasoning engine currently plugged in, chosen per task and replaceable over time.</dd></div>
          </dl>
        </div>
      </section>


      <section className="cap-section upgrade-section">
        <header className="section-head wide">
          <span className="section-label">New operating layer</span>
          <h2>The past week turned the constellation into a real multi-agent system</h2>
          <p>
            The big upgrade is not a single new chatbot. It is the infrastructure around the agents: scheduled
            maintenance, safer updates, explicit ownership, background missions, public deployment gates, and
            cross-machine drift control.
          </p>
        </header>
        <div className="upgrade-grid">
          {UPGRADES.map((u, i) => (
            <article className={`upgrade-card accent-${u.accent} rise`} key={u.name} style={{ animationDelay: `${i * 65}ms` }}>
              <span className="upgrade-eyebrow">{u.eyebrow}</span>
              <h3>{u.name}</h3>
              <p>{u.blurb}</p>
              <span className="upgrade-proof">{u.proof}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="cap-section">
        <header className="section-head">
          <h2>Tools — the hands</h2>
          <p>Concrete abilities the agents can reach for, the way you might reach for a kettle or a screwdriver.</p>
        </header>
        <div className="tool-grid">
          {TOOLS.map((t, i) => (
            <article className="tool-card rise" key={t.name} style={{ animationDelay: `${i * 60}ms` }}>
              <span className="tool-icon">
                <Icon name={t.icon} size={24} />
              </span>
              <h3>{t.name}</h3>
              <p>{t.blurb}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cap-section">
        <header className="section-head">
          <h2>Skills — the playbooks</h2>
          <p>Rehearsed routines an agent can run start-to-finish. Teach a skill once and every persona knows it forever.</p>
        </header>
        <div className="skill-list">
          {SKILLS.map((s, i) => (
            <article className="skill-row rise" key={s.name} style={{ animationDelay: `${i * 50}ms` }}>
              <span className="skill-index">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{s.name}</h3>
                <p>{s.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cap-section">
        <header className="section-head">
          <h2>Models — the engine bay</h2>
          <p>
            The mind doing the thinking is swappable, like cartridges in a slot. A hard problem gets the flagship; a
            quick chore gets something light and fast. New models from any lab can be slotted in the day they ship.
          </p>
        </header>
        <div className="cartridge-rack" role="list">
          {MODELS.map((m, i) => (
            <div className={`cartridge accent-${m.accent} rise`} role="listitem" key={m.name} style={{ animationDelay: `${i * 70}ms` }}>
              <span className="cartridge-pins" aria-hidden="true" />
              <span className="cartridge-maker">{m.maker}</span>
              <span className="cartridge-name">{m.name}</span>
              <span className="cartridge-vibe">{m.vibe}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ---------- Personas tab ---------- */

export function Personas() {
  return (
    <div className="tab-pane">
      <header className="section-head">
        <h2>The crew</h2>
        <p>
          One system, many faces. Each persona is the same underlying agent wearing a different hat — a distinct
          voice, speciality, and home machine. Magnus decides who answers the call.
        </p>
      </header>
      <div className="persona-grid">
        {PERSONAS.map((p, i) => (
          <article
            className={`persona-card accent-${p.accent} status-${p.status} rise`}
            key={p.id}
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="persona-top">
              <span className="persona-avatar">
                <Icon name={p.icon} size={26} />
              </span>
              <span className={`status-pill status-${p.status}`}>
                <span className="status-dot" aria-hidden="true" />
                {p.statusLabel}
              </span>
            </div>
            <h3>{p.name}</h3>
            <p className="persona-title">{p.title}</p>
            <p className="persona-desc">{p.description}</p>
            <ul className="trait-row">
              {p.traits.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}

/* ---------- Journey tab ---------- */

export function Journey() {
  return (
    <div className="tab-pane">
      <header className="section-head">
        <h2>The life of a request</h2>
        <p>From a thumb on a phone screen to an answer — and sometimes a warmer room — in six moves.</p>
      </header>
      <ol className="journey-line">
        {JOURNEY.map((j, i) => (
          <li className={`journey-step accent-${j.accent} rise`} key={j.num} style={{ animationDelay: `${i * 90}ms` }}>
            <span className="journey-marker">
              <Icon name={j.icon} size={20} />
            </span>
            <div className="journey-body">
              <span className="journey-num">{j.num}</span>
              <h3>{j.title}</h3>
              <p>{j.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <aside className="privacy-card">
        <span className="privacy-icon">
          <Icon name="shield" size={24} />
        </span>
        <div>
          <h3>Built private-first</h3>
          <p>
            The machines talk to each other over Tailscale — an invitation-only private network that works like glowing
            sealed tunnels between them. The smart home never touches the open internet, notes stay in the vault on
            Benjamin&apos;s own hardware, and the only public doorway is the Telegram chat itself.
          </p>
        </div>
      </aside>
    </div>
  )
}
