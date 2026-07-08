import { useEffect, useMemo, useState } from 'react'

type LoadState = 'loading' | 'ready' | 'error'

type Money = { amount: number; currency: string }
type Summary = {
  period?: { label?: string }
  generatedAt?: string
  source?: { latestSyncAt?: string; mode?: string }
  kpis?: {
    cashPosition?: Money[]
    income?: Money[]
    outgoings?: Money[]
    netCashFlow?: Money[]
    savingsRate?: number | null
    cashRunwayMonths?: number | null
    reviewCount?: number
    missingReceiptCount?: number
  }
  alerts?: Array<{ title?: string; message?: string; severity?: string }>
  categorySpend?: Array<{ category?: string; amount?: number; currency?: string }>
  recurringPreview?: Array<{ merchant?: string; typicalAmount?: number; currency?: string; cadence?: string; reviewStatus?: string }>
  nextActions?: Array<{ title?: string; message?: string; severity?: string }>
}

type ReviewQueue = { items?: Array<{ id?: string; category?: string; title?: string; detail?: string; amount?: number; currency?: string; severity?: string }> }
type Freshness = { sources?: Array<{ name?: string; status?: string; latestSyncAt?: string; recordCount?: number }> }

const currency = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 })

function gbp(items?: Money[]) {
  const amount = items?.find((item) => item.currency === 'GBP')?.amount ?? 0
  return currency.format(amount)
}

function money(amount?: number, code = 'GBP') {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: code, maximumFractionDigits: 0 }).format(amount ?? 0)
}

async function loadJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: 'no-store', credentials: 'same-origin' })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`)
  return data as T
}

export function FinanceCockpit({ onBack }: { onBack: () => void }) {
  const [state, setState] = useState<LoadState>('loading')
  const [error, setError] = useState('')
  const [summary, setSummary] = useState<Summary | null>(null)
  const [review, setReview] = useState<ReviewQueue | null>(null)
  const [freshness, setFreshness] = useState<Freshness | null>(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      setState('loading')
      setError('')
      try {
        const [summaryData, reviewData, freshnessData] = await Promise.all([
          loadJson<Summary>('/api/finance/summary'),
          loadJson<ReviewQueue>('/api/finance/review-queue'),
          loadJson<Freshness>('/api/finance/audit/source-freshness'),
        ])
        if (!cancelled) {
          setSummary(summaryData)
          setReview(reviewData)
          setFreshness(freshnessData)
          setState('ready')
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load finance cockpit')
          setState('error')
        }
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [])

  const kpis = summary?.kpis
  const importantActions = useMemo(() => (review?.items ?? []).slice(0, 8), [review])

  return (
    <div className="shell finance-shell">
      <header className="global-nav">
        <div className="global-nav-inner">
          <button type="button" className="brand" onClick={onBack}>
            Magnus <span className="brand-slash">/</span> Sterling Finance
          </button>
          <nav className="global-nav-links" aria-label="Finance cockpit">
            <button type="button" className="global-nav-link" onClick={onBack}>
              ‹ Back to dashboards
            </button>
          </nav>
        </div>
      </header>

      <section className="hero dashboards-hero finance-hero">
        <p className="hero-kicker">Personal finance cockpit</p>
        <h1 className="hero-title">Sterling Finance Cockpit</h1>
        <p className="hero-sub">
          Live read-only view from the Sterling finance warehouse, served inside Magnus. No finance data is bundled into
          the public client; authenticated Magnus API routes fetch it server-side.
        </p>
      </section>

      {state === 'loading' && <div className="finance-message">Loading live finance data…</div>}
      {state === 'error' && (
        <div className="finance-message warning">
          <strong>Finance cockpit is not available yet.</strong>
          <span>{error}</span>
        </div>
      )}

      {state === 'ready' && summary && (
        <main className="finance-grid">
          <section className="finance-panel finance-panel-hero">
            <p className="eyebrow">Current period</p>
            <h2>{summary.period?.label ?? 'Current period'}</h2>
            <p>Generated {summary.generatedAt ? new Date(summary.generatedAt).toLocaleString('en-GB') : 'just now'}.</p>
            <div className="finance-kpis">
              <article><span>Cash position</span><strong>{gbp(kpis?.cashPosition)}</strong></article>
              <article><span>Income</span><strong>{gbp(kpis?.income)}</strong></article>
              <article><span>Outgoings</span><strong>{gbp(kpis?.outgoings)}</strong></article>
              <article><span>Net cash flow</span><strong>{gbp(kpis?.netCashFlow)}</strong></article>
              <article><span>Savings rate</span><strong>{kpis?.savingsRate == null ? '—' : `${kpis.savingsRate}%`}</strong></article>
              <article><span>Runway</span><strong>{kpis?.cashRunwayMonths == null ? '—' : `${kpis.cashRunwayMonths} mo`}</strong></article>
            </div>
          </section>

          <section className="finance-panel">
            <h3>Review queue</h3>
            <p>{kpis?.reviewCount ?? 0} items need review · {kpis?.missingReceiptCount ?? 0} missing receipts.</p>
            <div className="finance-list">
              {importantActions.map((item) => (
                <article key={item.id ?? `${item.title}-${item.category}`}>
                  <strong>{item.title ?? item.category ?? 'Review item'}</strong>
                  <span>{item.detail ?? item.category}</span>
                  <em>{money(item.amount, item.currency)} · {item.severity ?? 'review'}</em>
                </article>
              ))}
            </div>
          </section>

          <section className="finance-panel">
            <h3>Category spend</h3>
            <div className="finance-list compact">
              {(summary.categorySpend ?? []).slice(0, 8).map((row) => (
                <article key={row.category}>
                  <strong>{row.category ?? 'Uncategorised'}</strong>
                  <em>{money(row.amount, row.currency)}</em>
                </article>
              ))}
            </div>
          </section>

          <section className="finance-panel">
            <h3>Recurring payments</h3>
            <div className="finance-list compact">
              {(summary.recurringPreview ?? []).slice(0, 8).map((row) => (
                <article key={`${row.merchant}-${row.typicalAmount}`}>
                  <strong>{row.merchant ?? 'Recurring payment'}</strong>
                  <span>{row.cadence ?? 'cadence unknown'} · {row.reviewStatus ?? 'unknown'}</span>
                  <em>{money(row.typicalAmount, row.currency)}</em>
                </article>
              ))}
            </div>
          </section>

          <section className="finance-panel">
            <h3>Source freshness</h3>
            <div className="finance-list compact">
              {(freshness?.sources ?? []).slice(0, 8).map((source) => (
                <article key={source.name}>
                  <strong>{source.name ?? 'Source'}</strong>
                  <span>{source.latestSyncAt ?? 'No sync timestamp'}</span>
                  <em>{source.status ?? 'unknown'} · {source.recordCount ?? 0} records</em>
                </article>
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  )
}
