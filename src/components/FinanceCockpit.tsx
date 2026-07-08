import { type CSSProperties, useEffect, useMemo, useState } from 'react'

type LoadState = 'loading' | 'ready' | 'error'
type Money = { amount: number; currency: string }
type Warning = { id?: string; severity?: string; title?: string; detail?: string; metric?: string }
type KpiDef = { definition?: string; caveats?: string[]; confidence?: string }

type Summary = {
  period?: { label?: string }
  generatedAt?: string
  source?: { latestSyncAt?: string; mode?: string; status?: string; staleThresholdHours?: number }
  warehouseScope?: { totalTransactions?: number; currentPeriodTransactions?: number; latestSyncTransactionCount?: number | null; activeSourceCount?: number; warehouseDateRange?: { min?: string | null; max?: string | null } }
  reviewCounts?: { distinctTransactions?: number; reviewTasks?: number; missingEvidenceTasks?: number }
  kpiDefinitions?: Record<string, KpiDef>
  dataQualityWarnings?: Warning[]
  kpis?: {
    cashPosition?: Money[]
    ordinaryIncome?: Money[]
    income?: Money[]
    ordinarySpending?: Money[]
    outgoings?: Money[]
    ordinaryNetCashFlow?: Money[]
    netCashFlow?: Money[]
    savingsRate?: number | null
    cashRunwayMonths?: number | null
    cashRunway?: { months?: number | null; averageCoreMonthlyExpense?: Money[]; cashAndEquivalents?: Money[]; trailingMonths?: number; definition?: string; confidence?: string; caveats?: string[] }
    reviewCount?: number
    reviewTaskCount?: number
    distinctReviewTransactionCount?: number
    missingEvidenceTaskCount?: number
    missingReceiptCount?: number
  }
  alerts?: Array<{ title?: string; detail?: string; message?: string; severity?: string; suggestedNextStep?: string; evidenceRef?: string }>
  categorySpend?: Array<{ name?: string; category?: string; amount?: number; currency?: string; transactionCount?: number }>
  recurringPreview?: Array<{ merchantLabel?: string; merchant?: string; typicalAmount?: number; monthlyEquivalent?: number; currency?: string; cadence?: string; reviewStatus?: string; reviewReasons?: string[]; amountChangePct?: number | null; previousAmount?: number | null; confidence?: number }>
  recurringSummary?: { recurringCount?: number; reviewCount?: number; newCount?: number; priceIncreaseCount?: number; estimatedMonthlyCommitment?: Money[]; lowConfidenceCount?: number }
}

type ReviewQueue = {
  summary?: { distinctTransactionCount?: number; taskCount?: number; byCategory?: Record<string, number>; bySeverity?: Record<string, number> }
  items?: Array<{ id?: string; category?: string; categories?: string[]; reasons?: string[]; title?: string; detail?: string; amount?: number | null; currency?: string; severity?: string; evidenceRef?: string }>
}

type Freshness = {
  sourceHealth?: { latestCompletedSyncAt?: string | null; staleThresholdHours?: number; status?: string; latestSyncPayloadCounts?: Record<string, number | null>; warehouseCounts?: Record<string, number> }
  classificationHealth?: { totalTransactions?: number; uncategorisedCount?: number; lowConfidenceCount?: number; needsReviewCount?: number; missingReceiptCount?: number }
  sources?: Array<{ label?: string; name?: string; status?: string; latestSyncAt?: string; last_synced_at?: string; recordCount?: number | null }>
}

type Recurring = {
  summary?: { recurringCount?: number; reviewCount?: number; newCount?: number; priceIncreaseCount?: number; estimatedMonthlyCommitment?: Money[]; lowConfidenceCount?: number }
  items?: NonNullable<Summary['recurringPreview']>
  quality?: Warning[]
}

type ChartSegment = {
  id: string
  label: string
  kind: 'asset' | 'liability' | 'net_worth' | string
  value: number
  signedValue: number
  currency: string
  colour: string
  confidence: 'high' | 'medium' | 'low'
  caveats: string[]
}

type BalanceChart = {
  title: string
  question: string
  asOf: string
  currency: string
  segments: ChartSegment[]
  totals: { assets: number; liabilities: number; estimatedNetWorth: number; confidence: 'high' | 'medium' | 'low' }
  completenessCaveats: string[]
  dataQualityWarnings: Warning[]
  definition: string
  adviceBoundary: string
}

type MonthlyCashflowPoint = {
  month: string
  label: string
  ordinaryIncome: number
  ordinarySpending: number
  ordinaryNetCashflow: number
  assetSaleProceeds: number
  reimbursementsAndAdminExcluded: number
  excludedTransfers: number
  currency: string
  isPartial: boolean
  warnings: string[]
}

type MonthlyCashflowChart = {
  title: string
  question: string
  windowMonths: number
  startMonth: string
  endMonth: string
  currency: string
  series: MonthlyCashflowPoint[]
  definition: string
  exclusions: string[]
  dataQualityWarnings: Warning[]
  caveats: string[]
}

type Balance = {
  chart?: BalanceChart
  totals?: { assets?: Money[]; liabilities?: Money[]; netWorth?: Money[]; confidence?: string }
  runway?: { months?: number | null; coreMonthlyExpense?: Money[]; cashAndEquivalents?: Money[]; trailingMonths?: number; confidence?: string; caveats?: string[] }
  completeness?: Record<string, boolean>
  dataQuality?: Warning[]
}

type Cashflow = {
  monthlyChart?: MonthlyCashflowChart
}

const currency = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 })

function gbp(items?: Money[]) {
  const amount = items?.find((item) => item.currency === 'GBP')?.amount ?? 0
  return currency.format(amount)
}

function money(amount?: number | null, code = 'GBP') {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: code, maximumFractionDigits: 0 }).format(amount ?? 0)
}

function fmtDate(value?: string | null) {
  if (!value) return 'No timestamp'
  return new Date(value).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}

async function loadJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: 'no-store', credentials: 'same-origin' })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.error || `Request failed: ${res.status}`)
  return data as T
}

function severityLabel(severity?: string) {
  if (severity === 'blocker') return 'Blocker'
  if (severity === 'important') return 'Important'
  if (severity === 'review') return 'Review'
  return 'Info'
}

function completenessLabel(key: string) {
  return key.replace(/^has/, '').replace(/[A-Z]/g, (m) => ` ${m.toLowerCase()}`).trim()
}

function formatSigned(amount: number, code = 'GBP') {
  const prefix = amount > 0 ? '+' : ''
  return `${prefix}${money(amount, code)}`
}

function safeRatio(value: number, max: number, floor = 3) {
  if (!max) return floor
  return Math.max(floor, Math.min(100, Math.round((Math.abs(value) / max) * 100)))
}

function BalanceSheetChartPanel({ chart }: { chart?: BalanceChart }) {
  if (!chart) return null
  const assetSegments = chart.segments.filter((segment) => segment.kind === 'asset')
  const liability = chart.segments.find((segment) => segment.kind === 'liability')
  const maxMagnitude = Math.max(chart.totals.assets, chart.totals.liabilities, Math.abs(chart.totals.estimatedNetWorth), 1)
  const caveats = [...(chart.completenessCaveats ?? []), ...(chart.dataQualityWarnings ?? []).map((w) => w.title ?? w.detail ?? '')].filter(Boolean).slice(0, 4)

  return (
    <section className="finance-panel chart-panel wealth-chart-panel">
      <div className="chart-panel-heading">
        <div>
          <p className="eyebrow">Balance sheet = current wealth</p>
          <h3>{chart.title}</h3>
          <p>{chart.question}</p>
        </div>
        <span className={`confidence-badge ${chart.totals.confidence}`}>{chart.totals.confidence} confidence</span>
      </div>

      <div className="wealth-totals">
        <article><span>Assets</span><strong>{money(chart.totals.assets, chart.currency)}</strong></article>
        <article><span>Liabilities</span><strong>{money(chart.totals.liabilities, chart.currency)}</strong></article>
        <article className="net-worth-total"><span>Estimated net worth</span><strong>{money(chart.totals.estimatedNetWorth, chart.currency)}</strong></article>
      </div>

      <div className="wealth-bars" aria-label="Balance sheet current wealth chart">
        {assetSegments.map((segment) => (
          <div className="wealth-bar-row" key={segment.id}>
            <span>{segment.label}</span>
            <div className="wealth-bar-track"><div className="wealth-bar asset" style={{ width: `${safeRatio(segment.value, maxMagnitude)}%`, background: segment.colour }} /></div>
            <strong>{money(segment.value, segment.currency)}</strong>
          </div>
        ))}
        {liability && (
          <div className="wealth-bar-row liability-row">
            <span>{liability.label}</span>
            <div className="wealth-bar-track"><div className="wealth-bar liability" style={{ width: `${safeRatio(liability.value, maxMagnitude)}%`, background: liability.colour }} /></div>
            <strong>-{money(liability.value, liability.currency)}</strong>
          </div>
        )}
        <div className="wealth-net-marker" style={{ '--net-position': `${safeRatio(chart.totals.estimatedNetWorth, maxMagnitude, 8)}%` } as CSSProperties}>
          <span>Net worth marker</span>
          <strong>{money(chart.totals.estimatedNetWorth, chart.currency)}</strong>
        </div>
      </div>

      {caveats.length > 0 && (
        <div className="chart-caveats">
          {caveats.map((caveat) => <span key={caveat}>{caveat}</span>)}
        </div>
      )}
      <p className="chart-definition">{chart.definition}</p>
      <p className="chart-boundary">{chart.adviceBoundary}</p>
    </section>
  )
}

function CashflowChartPanel({ chart }: { chart?: MonthlyCashflowChart }) {
  if (!chart) return null
  const maxMagnitude = Math.max(...chart.series.flatMap((point) => [point.ordinaryIncome, point.ordinarySpending, Math.abs(point.ordinaryNetCashflow)]), 1)
  const warnings = [...(chart.dataQualityWarnings ?? []).map((w) => w.title ?? w.detail ?? ''), ...chart.series.flatMap((point) => point.warnings.map((warning) => `${point.label}: ${warning}`))].filter(Boolean).slice(0, 5)

  return (
    <section className="finance-panel chart-panel cashflow-chart-panel">
      <div className="chart-panel-heading">
        <div>
          <p className="eyebrow">Cashflow = direction of travel</p>
          <h3>{chart.title}</h3>
          <p>{chart.question}</p>
        </div>
        <span className="confidence-badge info">{chart.windowMonths} months</span>
      </div>

      <div className="cashflow-chart" aria-label="Monthly cashflow direction of travel chart">
        {chart.series.map((point) => (
          <div className={`cashflow-month ${point.isPartial ? 'partial' : ''}`} key={point.month} title={`${point.label}: net ${formatSigned(point.ordinaryNetCashflow, point.currency)}`}>
            <div className="cashflow-bars">
              <div className="cashflow-positive" style={{ height: `${safeRatio(point.ordinaryIncome, maxMagnitude, 2)}%` }} />
              <div className="cashflow-net-dot" style={{ bottom: `${safeRatio(point.ordinaryNetCashflow, maxMagnitude, 8)}%` }} />
              <div className="cashflow-negative" style={{ height: `${safeRatio(point.ordinarySpending, maxMagnitude, 2)}%` }} />
            </div>
            <span>{point.label}</span>
            {(point.warnings.length > 0 || point.assetSaleProceeds || point.reimbursementsAndAdminExcluded || point.excludedTransfers) ? <em aria-label="Month has annotations">•</em> : null}
          </div>
        ))}
      </div>

      <div className="cashflow-legend">
        <span><i className="income" /> Ordinary income</span>
        <span><i className="spend" /> Ordinary spending</span>
        <span><i className="net" /> Net cashflow</span>
        <span><i className="partial" /> Partial month</span>
      </div>

      <div className="cashflow-snapshot">
        {chart.series.slice(-3).map((point) => (
          <article key={point.month}>
            <span>{point.label}</span>
            <strong>{formatSigned(point.ordinaryNetCashflow, point.currency)}</strong>
            <small>Income {money(point.ordinaryIncome, point.currency)} · Spend {money(point.ordinarySpending, point.currency)}</small>
          </article>
        ))}
      </div>

      {warnings.length > 0 && <div className="chart-caveats">{warnings.map((warning) => <span key={warning}>{warning}</span>)}</div>}
      <p className="chart-definition">{chart.definition}</p>
    </section>
  )
}

export function FinanceCockpit({ onBack }: { onBack: () => void }) {
  const [state, setState] = useState<LoadState>('loading')
  const [error, setError] = useState('')
  const [summary, setSummary] = useState<Summary | null>(null)
  const [review, setReview] = useState<ReviewQueue | null>(null)
  const [freshness, setFreshness] = useState<Freshness | null>(null)
  const [recurring, setRecurring] = useState<Recurring | null>(null)
  const [balance, setBalance] = useState<Balance | null>(null)
  const [cashflow, setCashflow] = useState<Cashflow | null>(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      setState('loading')
      setError('')
      try {
        const [summaryData, reviewData, freshnessData, recurringData, balanceData, cashflowData] = await Promise.all([
          loadJson<Summary>('/api/finance/summary'),
          loadJson<ReviewQueue>('/api/finance/review-queue'),
          loadJson<Freshness>('/api/finance/audit/source-freshness'),
          loadJson<Recurring>('/api/finance/regular-expenses'),
          loadJson<Balance>('/api/finance/balance-sheet'),
          loadJson<Cashflow>('/api/finance/cash-flow?months=12'),
        ])
        if (!cancelled) {
          setSummary(summaryData)
          setReview(reviewData)
          setFreshness(freshnessData)
          setRecurring(recurringData)
          setBalance(balanceData)
          setCashflow(cashflowData)
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
  const warnings = useMemo(() => [...(summary?.dataQualityWarnings ?? []), ...(recurring?.quality ?? []), ...(balance?.dataQuality ?? [])].slice(0, 8), [summary, recurring, balance])
  const attentionItems = useMemo(() => (review?.items ?? []).slice(0, 5), [review])
  const recurringItems = useMemo(() => (recurring?.items ?? summary?.recurringPreview ?? []).slice(0, 8), [recurring, summary])
  const completeness = balance?.completeness ?? {}

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
          Live read-only control room from the Sterling finance warehouse. This screen answers what needs attention,
          where cash is going, which recurring expenses need review, and how reliable the evidence is.
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
        <main className="finance-grid upgraded">
          <section className="finance-panel finance-panel-hero">
            <div className="finance-panel-heading">
              <div>
                <p className="eyebrow">Executive cockpit</p>
                <h2>{summary.source?.status === 'live' ? 'Live sync' : 'Sync needs review'} · {review?.summary?.taskCount ?? summary.reviewCounts?.reviewTasks ?? 0} review tasks</h2>
                <p>
                  Period {summary.period?.label ?? 'current'} · generated {summary.generatedAt ? fmtDate(summary.generatedAt) : 'just now'} · source {summary.source?.mode ?? 'unknown'}.
                </p>
              </div>
              <span className={`finance-status-pill ${summary.source?.status ?? 'unknown'}`}>{summary.source?.status ?? 'unknown'}</span>
            </div>
            <div className="finance-kpis">
              <article><span>Cash position</span><strong>{gbp(kpis?.cashPosition)}</strong><small>{kpis?.cashRunway?.cashAndEquivalents ? 'liquid evidence' : 'latest balance'}</small></article>
              <article><span>Ordinary income</span><strong>{gbp(kpis?.ordinaryIncome ?? kpis?.income)}</strong><small>transfer-excluded</small></article>
              <article><span>Ordinary spending</span><strong>{gbp(kpis?.ordinarySpending ?? kpis?.outgoings)}</strong><small>transfer-excluded</small></article>
              <article><span>Ordinary net flow</span><strong>{gbp(kpis?.ordinaryNetCashFlow ?? kpis?.netCashFlow)}</strong><small>not balance movement</small></article>
              <article><span>Runway</span><strong>{kpis?.cashRunwayMonths == null ? '—' : `${kpis.cashRunwayMonths} mo`}</strong><small>{kpis?.cashRunway?.trailingMonths ?? balance?.runway?.trailingMonths ?? '—'} trailing months</small></article>
              <article><span>Review tasks</span><strong>{review?.summary?.taskCount ?? summary.reviewCounts?.reviewTasks ?? 0}</strong><small>{review?.summary?.distinctTransactionCount ?? summary.reviewCounts?.distinctTransactions ?? 0} transactions</small></article>
            </div>
          </section>

          <section className="finance-chart-hero-row" aria-label="Primary finance charts">
            <BalanceSheetChartPanel chart={balance?.chart} />
            <CashflowChartPanel chart={cashflow?.monthlyChart} />
          </section>

          <section className="finance-panel finance-wide">
            <h3>Data-quality warnings</h3>
            <p>First-class caveats from the API, not logs. These explain confidence before you trust the numbers.</p>
            <div className="warning-strip">
              {warnings.map((warning) => (
                <article className={`warning-card ${warning.severity ?? 'info'}`} key={warning.id ?? warning.title}>
                  <span>{severityLabel(warning.severity)}</span>
                  <strong>{warning.title}</strong>
                  <p>{warning.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="finance-panel">
            <h3>Top attention items</h3>
            <p>{review?.summary?.distinctTransactionCount ?? 0} distinct transaction(s) expand into {review?.summary?.taskCount ?? 0} task(s).</p>
            <div className="finance-list">
              {attentionItems.map((item) => (
                <article key={item.id ?? `${item.title}-${item.category}`}>
                  <strong>{item.title ?? item.category ?? 'Review item'}</strong>
                  <span>{(item.reasons ?? item.categories ?? [item.category]).filter(Boolean).join(' · ')}</span>
                  <span>{item.detail}</span>
                  <em>{item.amount == null ? 'Evidence task' : money(item.amount, item.currency)} · {item.severity ?? 'review'} · {item.evidenceRef}</em>
                </article>
              ))}
            </div>
          </section>

          <section className="finance-panel recurring-panel">
            <h3>Recurring expenses / subscriptions</h3>
            <div className="finance-mini-kpis">
              <article><span>Detected</span><strong>{recurring?.summary?.recurringCount ?? summary.recurringSummary?.recurringCount ?? 0}</strong></article>
              <article><span>Review</span><strong>{recurring?.summary?.reviewCount ?? summary.recurringSummary?.reviewCount ?? 0}</strong></article>
              <article><span>New</span><strong>{recurring?.summary?.newCount ?? summary.recurringSummary?.newCount ?? 0}</strong></article>
              <article><span>Price ↑</span><strong>{recurring?.summary?.priceIncreaseCount ?? summary.recurringSummary?.priceIncreaseCount ?? 0}</strong></article>
              <article><span>Monthly commitment</span><strong>{gbp(recurring?.summary?.estimatedMonthlyCommitment ?? summary.recurringSummary?.estimatedMonthlyCommitment)}</strong></article>
            </div>
            <div className="finance-list recurring-list">
              {recurringItems.map((row) => (
                <article key={`${row.merchantLabel ?? row.merchant}-${row.typicalAmount}`}>
                  <strong>{row.merchantLabel ?? row.merchant ?? 'Recurring payment'}</strong>
                  <span>{row.cadence ?? 'cadence unknown'} · {row.reviewStatus ?? 'unknown'} · confidence {row.confidence == null ? '—' : Math.round(row.confidence * 100)}%</span>
                  <span>{(row.reviewReasons ?? []).join(' · ') || 'Recurring payment candidate'}</span>
                  <em>{money(row.monthlyEquivalent ?? row.typicalAmount, row.currency)} / mo {row.amountChangePct == null ? '' : `· ${row.amountChangePct > 0 ? '+' : ''}${row.amountChangePct}%`}</em>
                </article>
              ))}
            </div>
          </section>

          <section className="finance-panel">
            <h3>Warehouse & source scope</h3>
            <div className="finance-list compact">
              <article><strong>Total warehouse transactions</strong><em>{summary.warehouseScope?.totalTransactions ?? freshness?.classificationHealth?.totalTransactions ?? 0}</em></article>
              <article><strong>Latest sync payload</strong><em>{summary.warehouseScope?.latestSyncTransactionCount ?? freshness?.sourceHealth?.latestSyncPayloadCounts?.transactions ?? '—'}</em></article>
              <article><strong>Current period rows</strong><em>{summary.warehouseScope?.currentPeriodTransactions ?? '—'}</em></article>
              <article><strong>Active sources</strong><em>{summary.warehouseScope?.activeSourceCount ?? '—'}</em></article>
              <article><strong>Latest completed sync</strong><span>{fmtDate(freshness?.sourceHealth?.latestCompletedSyncAt ?? summary.source?.latestSyncAt)}</span><em>{freshness?.sourceHealth?.status ?? summary.source?.status}</em></article>
              <article><strong>Low-confidence classifications</strong><em>{freshness?.classificationHealth?.lowConfidenceCount ?? 0}</em></article>
            </div>
          </section>

          <section className="finance-panel">
            <h3>Category spend</h3>
            <div className="finance-list compact">
              {(summary.categorySpend ?? []).slice(0, 8).map((row) => (
                <article key={row.name ?? row.category}>
                  <strong>{row.name ?? row.category ?? 'Uncategorised'}</strong>
                  <span>{row.transactionCount ?? 0} transaction(s)</span>
                  <em>{money(row.amount, row.currency)}</em>
                </article>
              ))}
            </div>
          </section>

          <section className="finance-panel finance-wide">
            <h3>Balance sheet evidence & runway</h3>
            <div className="finance-mini-kpis">
              <article><span>Assets</span><strong>{gbp(balance?.totals?.assets)}</strong></article>
              <article><span>Liabilities</span><strong>{gbp(balance?.totals?.liabilities)}</strong></article>
              <article><span>Net estimate</span><strong>{gbp(balance?.totals?.netWorth)}</strong></article>
              <article><span>Core monthly expense</span><strong>{gbp(balance?.runway?.coreMonthlyExpense)}</strong></article>
              <article><span>Confidence</span><strong>{balance?.totals?.confidence ?? '—'}</strong></article>
            </div>
            <div className="completeness-grid">
              {Object.entries(completeness).map(([key, ok]) => (
                <span className={ok ? 'complete' : 'missing'} key={key}>{ok ? '✓' : 'Needs evidence'} {completenessLabel(key)}</span>
              ))}
            </div>
            <p className="finance-definition">Runway definition: {kpis?.cashRunway?.definition ?? balance?.runway?.caveats?.[0] ?? 'Canonical trailing-month core-expense definition.'}</p>
          </section>
        </main>
      )}
    </div>
  )
}
