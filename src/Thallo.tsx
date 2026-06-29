import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Icon } from './components/Icon'

type PatientListItem = {
  id: number
  firstName: string
  lastName: string
  dob: string | null
  status: string
  phone: string | null
}

type TimelineEvent = {
  date: string | null
  kind: string
  title: string
  detail?: string
}

type PatientDetail = {
  patient: {
    id: number
    firstName: string
    lastName: string
    dob: string | null
    sex: string | null
    status: string
    allergies: string | null
    medicalHistory: string | null
  }
  contacts: Array<{ id: number; kind: string; value: string; label: string | null; isPrimary: boolean }>
  treatments: Array<{ id: number; procedureType: string; performedAt: string | null; clinician: string | null; summary: string | null }>
  followUps: Array<{ id: number; dueDate: string | null; status: string; reason: string | null }>
  appointments: Array<{ id: number; scheduledFor: string; status: string; kind: string | null }>
  timeline: TimelineEvent[]
}

type ThalloSection = 'menu' | 'patients' | 'org' | 'rulebook'

const departments = [
  {
    name: 'Marketing',
    lead: 'Marketing Director Agent',
    mission: 'Create demand, build trust, improve public presence and campaign quality.',
    workers: ['Website & SEO Agent', 'Content Agent', 'Campaign Planner Agent'],
  },
  {
    name: 'Customer Acquisition',
    lead: 'Head of Customer Acquisition Agent',
    mission: 'Turn appropriate interest into booked consultations and treatments.',
    workers: ['Lead Capture Agent', 'Referral Agent', 'Enquiry Follow-up Agent'],
  },
  {
    name: 'Customer Retention & Value Maximisation',
    lead: 'Client Success Director Agent',
    mission: 'Increase repeat business, lifetime value, referrals, and review opportunities.',
    workers: ['Client Success & Recall Agent', 'Reactivation Agent', 'Review/Reputation Agent'],
  },
  {
    name: 'Finance',
    lead: 'Finance Director Agent',
    mission: 'Protect and improve profit, cash visibility, payments, expenses, and tax readiness.',
    workers: ['Payments Agent', 'Bookkeeping Agent', 'Tax Planning Agent', 'Profitability Analyst Agent'],
  },
  {
    name: 'Product & Services',
    lead: 'Product & Services Director Agent',
    mission: 'Decide what Thallo should offer and optimise margin, time, scalability, and risk.',
    workers: ['Service Profitability Agent', 'Pricing Agent', 'Treatment Pathway Agent', 'New Product Research Agent'],
  },
  {
    name: 'Legal, Risk & Compliance',
    lead: 'Legal, Risk & Compliance Director Agent',
    mission: 'Keep Thallo safe, compliant, insurable, and professionally defensible.',
    workers: ['Clinical Governance Agent', 'Advertising Compliance Agent', 'GDPR/Data Protection Agent', 'Red-Team Risk Agent'],
  },
  {
    name: 'Operations',
    lead: 'Operations Manager Agent',
    mission: 'Keep the practice running smoothly day to day.',
    workers: ['Scheduling Agent', 'Stock Agent', 'Clinic Prep Agent'],
  },
  {
    name: 'Digital/Product Engineering',
    lead: 'Digital Product Lead Agent',
    mission: 'Improve the Thallo dashboard, data quality, reporting, and safe automation tooling.',
    workers: ['Dashboard/Product Agent', 'Data Quality Agent', 'Reporting Agent'],
  },
  {
    name: 'Strategy & Performance',
    lead: 'Strategy Director / Board Advisor Agent',
    mission: 'Help Jeff think like a CEO through KPI review, strategy, market intelligence, and challenge.',
    workers: ['KPI Analyst Agent', 'Competitor Intelligence Agent', 'Strategic Board Agent'],
  },
]

function formatDate(value: string | null | undefined) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const message = data?.error === 'thallo_proxy_not_configured'
      ? 'Thallo proxy is not configured yet.'
      : data?.error === 'not_authenticated'
        ? 'Please sign in again.'
        : 'Could not load Thallo data.'
    throw new Error(message)
  }
  return data as T
}

function PatientDashboard() {
  const [query, setQuery] = useState('')
  const [patients, setPatients] = useState<PatientListItem[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [detail, setDetail] = useState<PatientDetail | null>(null)
  const [loadingList, setLoadingList] = useState(true)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [error, setError] = useState('')
  const detailRequestId = useRef(0)

  const selectedPatientName = useMemo(() => {
    const patient = patients.find((p) => p.id === selectedId)
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Patient detail'
  }, [patients, selectedId])

  const loadPatients = async (q = query) => {
    setLoadingList(true)
    setError('')
    try {
      const qs = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''
      const data = await fetchJson<{ patients: PatientListItem[] }>(`/api/thallo/patients${qs}`)
      setPatients(data.patients)
      if (selectedId && !data.patients.some((p) => p.id === selectedId)) {
        setSelectedId(null)
        setDetail(null)
      }
    } catch (e) {
      setPatients([])
      setDetail(null)
      setSelectedId(null)
      setError(e instanceof Error ? e.message : 'Could not load Thallo data.')
    } finally {
      setLoadingList(false)
    }
  }

  const loadDetail = async (id: number) => {
    const requestId = detailRequestId.current + 1
    detailRequestId.current = requestId
    setSelectedId(id)
    setLoadingDetail(true)
    setError('')
    try {
      const data = await fetchJson<PatientDetail>(`/api/thallo/patient?id=${id}`)
      if (detailRequestId.current === requestId) setDetail(data)
    } catch (e) {
      if (detailRequestId.current === requestId) {
        setDetail(null)
        setError(e instanceof Error ? e.message : 'Could not load patient detail.')
      }
    } finally {
      if (detailRequestId.current === requestId) setLoadingDetail(false)
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPatients('')
  }, [])
  /* eslint-enable react-hooks/exhaustive-deps */

  const submit = (e: FormEvent) => {
    e.preventDefault()
    void loadPatients(query)
  }

  return (
    <section className="thallo-data-shell" aria-label="Thallo patient database">
      <aside className="thallo-patient-list">
        <form className="thallo-search" onSubmit={submit}>
          <input
            className="portal-input"
            type="search"
            placeholder="Search patients…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search patients"
          />
          <button type="submit" className="portal-submit compact" disabled={loadingList}>
            {loadingList ? 'Loading…' : 'Search'}
          </button>
        </form>

        {error && <p className="portal-error data-error">{error}</p>}

        <div className="thallo-list-scroll">
          {loadingList ? (
            <p className="thallo-empty">Loading patients…</p>
          ) : patients.length === 0 ? (
            <p className="thallo-empty">No patients available.</p>
          ) : (
            patients.map((patient) => (
              <button
                key={patient.id}
                type="button"
                className={`thallo-patient-row ${patient.id === selectedId ? 'selected' : ''}`}
                onClick={() => void loadDetail(patient.id)}
              >
                <span className="thallo-patient-name">{patient.lastName}, {patient.firstName}</span>
                <span className="thallo-patient-meta">DOB {formatDate(patient.dob)} · {patient.status}</span>
              </button>
            ))
          )}
        </div>
      </aside>

      <section className="thallo-detail-panel" aria-live="polite">
        {loadingDetail ? (
          <p className="thallo-empty">Loading {selectedPatientName}…</p>
        ) : !detail ? (
          <div className="thallo-detail-empty">
            <Icon name="shield" size={34} />
            <h2>Select a patient</h2>
            <p>Open a record from the list to view read-only demographics, contacts, clinical summary, and timeline.</p>
          </div>
        ) : (
          <article className="thallo-record">
            <header className="thallo-record-head">
              <div>
                <p className="portal-kicker">Read-only record</p>
                <h2>{detail.patient.firstName} {detail.patient.lastName}</h2>
                <p>DOB {formatDate(detail.patient.dob)} · {detail.patient.sex ?? 'sex not recorded'} · {detail.patient.status}</p>
              </div>
            </header>

            <div className="thallo-record-grid">
              <section className="portal-info-card wide">
                <h4>Contacts</h4>
                {detail.contacts.length === 0 ? <p>None recorded.</p> : detail.contacts.map((contact) => (
                  <p key={contact.id}><strong>{contact.kind}</strong>: {contact.value}</p>
                ))}
              </section>

              <section className="portal-info-card wide">
                <h4>Clinical</h4>
                <p><strong>Allergies:</strong> {detail.patient.allergies || '—'}</p>
                <p><strong>History:</strong> {detail.patient.medicalHistory || '—'}</p>
              </section>

              <section className="portal-info-card wide">
                <h4>Treatments</h4>
                {detail.treatments.length === 0 ? <p>None recorded.</p> : detail.treatments.slice(0, 8).map((item) => (
                  <p key={item.id}>{formatDate(item.performedAt)} · {item.summary || item.procedureType}</p>
                ))}
              </section>

              <section className="portal-info-card wide">
                <h4>Follow-ups</h4>
                {detail.followUps.length === 0 ? <p>None recorded.</p> : detail.followUps.slice(0, 8).map((item) => (
                  <p key={item.id}>{formatDate(item.dueDate)} · {item.reason || 'Review'} · {item.status}</p>
                ))}
              </section>
            </div>

            <section className="portal-info-card timeline-card">
              <h4>Timeline</h4>
              {detail.timeline.length === 0 ? <p>No events recorded.</p> : detail.timeline.slice(0, 12).map((event, index) => (
                <p key={`${event.kind}-${index}`}><strong>{event.kind.replace('_', ' ')}</strong> · {formatDate(event.date)} · {event.title}</p>
              ))}
            </section>
          </article>
        )}
      </section>
    </section>
  )
}

type OrgSelection =
  | { kind: 'ceo' }
  | { kind: 'department'; index: number }
  | { kind: 'worker'; index: number; worker: string }

function OrganisationChart() {
  const [selection, setSelection] = useState<OrgSelection>({ kind: 'ceo' })

  const selectedDepartment = selection.kind === 'ceo' ? null : departments[selection.index]
  const selectedTitle = selection.kind === 'ceo'
    ? 'Jeff — Thallo CEO'
    : selection.kind === 'department'
      ? selectedDepartment?.name
      : selection.worker
  const selectedEyebrow = selection.kind === 'ceo'
    ? 'Executive layer'
    : selection.kind === 'department'
      ? 'Department lead'
      : 'Worker agent'
  const selectedSummary = selection.kind === 'ceo'
    ? 'Jeff owns company value, profitability, targets, department cadence, rule-book stewardship, approval governance, and weekly/monthly/quarterly reports.'
    : selection.kind === 'department'
      ? selectedDepartment?.mission
      : `${selection.worker} reports through ${selectedDepartment?.lead} to Jeff and produces draft-support work for Benjamin review.`

  return (
    <section className="thallo-org-shell" aria-label="Interactive Thallo organisation chart">
      <div className="thallo-org-intro">
        <div>
          <p className="portal-kicker">Interactive company map</p>
          <h2>Thallo AI team hierarchy</h2>
          <p>
            Thallo is modelled as an AI-assisted internal operating structure: Benjamin owns and approves,
            Jeff leads as CEO, departments organise specialist agents, and every output remains draft support.
          </p>
        </div>
        <div className="thallo-org-legend" aria-label="Governance summary">
          <span>Benjamin approval for external, clinical, financial, legal, regulatory, client-facing, or irreversible actions</span>
        </div>
      </div>

      <div className="thallo-org-board">
        <div className="thallo-org-visual" role="group" aria-label="Hierarchy: Benjamin to Jeff to department leads and worker agents">
          <div className="thallo-org-tier owner-tier">
            <div className="thallo-owner-node">
              <span className="org-node-label">Owner & final approval</span>
              <strong>Benjamin</strong>
            </div>
          </div>

          <div className="org-connector vertical" aria-hidden="true" />

          <div className="thallo-org-tier ceo-tier">
            <button
              type="button"
              className={`thallo-ceo-node ${selection.kind === 'ceo' ? 'selected' : ''}`}
              onClick={() => setSelection({ kind: 'ceo' })}
              aria-pressed={selection.kind === 'ceo'}
            >
              <span className="org-node-label">CEO</span>
              <strong>Jeff</strong>
              <span>Thallo CEO · reports to Benjamin</span>
            </button>
          </div>

          <div className="org-connector fan" aria-hidden="true" />

          <div className="thallo-department-grid interactive">
            {departments.map((department, index) => {
              const active = selection.kind !== 'ceo' && selection.index === index
              const compliance = department.name.includes('Compliance')
              return (
                <article className={`thallo-department-card ${active ? 'selected' : ''} ${compliance ? 'compliance' : ''}`} key={department.name}>
                  <button
                    type="button"
                    className="thallo-department-button"
                    onClick={() => setSelection({ kind: 'department', index })}
                    aria-pressed={selection.kind === 'department' && selection.index === index}
                  >
                    <span className="portal-kicker">{compliance ? 'Cross-functional review' : 'Department'}</span>
                    <span className="thallo-department-title">{department.name}</span>
                    <span><strong>Lead:</strong> {department.lead}</span>
                    <span>{department.mission}</span>
                  </button>
                  <div className="thallo-worker-cloud" role="group" aria-label={`${department.name} worker agents`}>
                    {department.workers.map((worker) => (
                      <button
                        key={worker}
                        type="button"
                        className={`thallo-worker-chip ${selection.kind === 'worker' && selection.worker === worker ? 'selected' : ''}`}
                        onClick={() => setSelection({ kind: 'worker', index, worker })}
                        aria-pressed={selection.kind === 'worker' && selection.worker === worker}
                      >
                        {worker}
                      </button>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <aside className="thallo-org-detail" aria-live="polite">
          <p className="portal-kicker">{selectedEyebrow}</p>
          <h3>{selectedTitle}</h3>
          <p>{selectedSummary}</p>

          {selectedDepartment && (
            <div className="thallo-detail-stack">
              <p><strong>Reports to:</strong> Jeff — Thallo CEO</p>
              <p><strong>Lead:</strong> {selectedDepartment.lead}</p>
              <p><strong>Worker agents:</strong> {selectedDepartment.workers.join(', ')}</p>
            </div>
          )}

          <div className="thallo-approval-card">
            <strong>Approval boundary</strong>
            <p>
              Agents may analyse, draft, monitor, organise, and report. Clinical, regulatory, financial,
              public, client-facing, or irreversible decisions stay with Benjamin.
            </p>
          </div>

          <div className="thallo-compliance-note">
            <Icon name="shield" size={18} />
            <span>Compliance is a review layer for public, clinical, legal, financial, regulatory, and client-facing work.</span>
          </div>
        </aside>
      </div>
    </section>
  )
}

function RuleBook() {
  const [meta, setMeta] = useState({ version: 'Loading…', updated: 'Loading…' })
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/thallo/rulebook?format=metadata', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Could not load rule book metadata.')
        return res.json() as Promise<{ version?: string; updated?: string }>
      })
      .then((data) => {
        setMeta({ version: data.version ?? 'Unknown', updated: data.updated ?? 'Unknown' })
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load rule book metadata.'))
  }, [])

  return (
    <section className="thallo-rulebook-shell" aria-label="Thallo organisation resources">
      <div className="portal-info-card wide thallo-rulebook-note">
        <div className="thallo-rulebook-head">
          <div>
            <p className="portal-kicker">Canonical resources and patient documents</p>
            <h3>Organisation Resources</h3>
          </div>
          <div className="thallo-rulebook-badges" aria-label="Rule book freshness">
            <span>Version {meta.version}</span>
            <span>Updated {meta.updated}</span>
          </div>
        </div>
        <p>
          Canonical operating documents and patient-facing resources for Thallo. The rule book remains
          shared-read and Jeff-only-edit after Benjamin approval; patient resources require clinician approval before use.
        </p>
        <div className="thallo-rulebook-actions">
          <a className="portal-submit thallo-rulebook-download" href="/api/thallo/rulebook?format=pdf" target="_blank" rel="noreferrer">
            Open latest PDF
          </a>
          <a className="portal-link-btn" href="/api/thallo/rulebook?format=pdf&download=1" download>
            Download PDF
          </a>
          <a className="portal-link-btn" href="/api/thallo/rulebook?format=markdown" target="_blank" rel="noreferrer">
            Open audit Markdown
          </a>
        </div>
        <div className="thallo-rulebook-actions">
          <a className="portal-submit thallo-rulebook-download" href="/thallo/thallo-health-microneedling-aftercare.pdf" target="_blank" rel="noreferrer">
            Open Microneedling Aftercare PDF
          </a>
          <a className="portal-link-btn" href="/thallo/thallo-health-microneedling-aftercare.pdf" download>
            Download Microneedling Aftercare PDF
          </a>
        </div>
        <p className="thallo-rulebook-source">
          Rule book PDF and audit Markdown are generated from the same public-safe rulebook copy. Patient resources are downloadable PDF assets for clinician-approved use.
        </p>
      </div>
      {error && <p className="portal-error">{error}</p>}
    </section>
  )
}

function ThalloMenu({ onSelect }: { onSelect: (section: ThalloSection) => void }) {
  return (
    <section className="thallo-workspace-menu" aria-label="Thallo workspace choices">
      <button type="button" className="portal-choice portal-thallo" onClick={() => onSelect('patients')}>
        <span className="portal-choice-icon"><Icon name="shield" size={26} /></span>
        <h2>Patient dashboard</h2>
        <p>Open the existing secured, read-only Thallo patient database workspace.</p>
        <span className="portal-choice-go">Open dashboard →</span>
      </button>
      <button type="button" className="portal-choice portal-thallo" onClick={() => onSelect('org')}>
        <span className="portal-choice-icon"><Icon name="hub" size={26} /></span>
        <h2>Organisation chart</h2>
        <p>View Jeff, departments, department leads, and worker agents.</p>
        <span className="portal-choice-go">View org chart →</span>
      </button>
      <button type="button" className="portal-choice portal-thallo" onClick={() => onSelect('rulebook')}>
        <span className="portal-choice-icon"><Icon name="doc" size={26} /></span>
        <h2>Organisation resources</h2>
        <p>Read company operating rules and download approved Thallo resource PDFs.</p>
        <span className="portal-choice-go">Open resources →</span>
      </button>
    </section>
  )
}

export function Thallo({ onBack, onLock }: { onBack: () => void; onLock: () => void }) {
  const [section, setSection] = useState<ThalloSection>('menu')

  const sectionTitle = {
    menu: 'Thallo workspace',
    patients: 'Thallo patients',
    org: 'Thallo organisation chart',
    rulebook: 'Thallo organisation resources',
  }[section]

  return (
    <div className="portal-screen portal-thallo">
      <header className="portal-bar">
        <span className="portal-brand">
          <span className="portal-mark">
            <Icon name="shield" size={16} />
          </span>
          Thallo
        </span>
        <div className="portal-bar-actions">
          {section !== 'menu' && (
            <button type="button" className="portal-link-btn" onClick={() => setSection('menu')}>
              ‹ Thallo menu
            </button>
          )}
          <button type="button" className="portal-link-btn" onClick={onBack}>
            ‹ Launcher
          </button>
          <button type="button" className="portal-link-btn" onClick={onLock}>
            Lock
          </button>
        </div>
      </header>

      <main className="portal-thallo-main data-mode">
        <div className="portal-thallo-hero compact">
          <p className="portal-kicker">Clinical workspace · private company OS</p>
          <h1>{sectionTitle}</h1>
        </div>

        {section === 'menu' && <ThalloMenu onSelect={setSection} />}
        {section === 'patients' && <PatientDashboard />}
        {section === 'org' && <OrganisationChart />}
        {section === 'rulebook' && <RuleBook />}
      </main>

      <footer className="portal-foot">
        <p>Thallo · private workspace</p>
      </footer>
    </div>
  )
}
