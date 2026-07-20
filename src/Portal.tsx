import { useEffect, useState, type FormEvent } from 'react'
import App from './App.tsx'
import { Thallo } from './Thallo'
import { Icon } from './components/Icon'
import './portal.css'

/* Top-level portal wrapper. App.tsx (the Magnus showcase) is left untouched and
   rendered as the "Magnus" view. Authentication is performed by server-side
   API routes that set an HttpOnly session cookie; Thallo data, when configured,
   is fetched only through server-side proxy routes. */

type View = 'launcher' | 'magnus' | 'thallo'

const DEV_USERNAME = 'bjgl'
const DEV_PASS_HASH = '2eeceb4ee583eb0e6699107ae667f605f2b9044c622c7ab392846cf3542f933f'

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function devLoginFallback(username: string, password: string): Promise<boolean> {
  if (!import.meta.env.DEV) return false
  return username.trim() === DEV_USERNAME && (await sha256Hex(password)) === DEV_PASS_HASH
}

async function authStatus(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/status', { cache: 'no-store' })
    if (!res.ok) return false
    const data = (await res.json()) as { authenticated?: boolean }
    return data.authenticated === true
  } catch {
    return false
  }
}

function Login({ onUnlock }: { onUnlock: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setChecking(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (res.ok) {
        onUnlock()
      } else if (await devLoginFallback(username, password)) {
        onUnlock()
      } else {
        setError('Incorrect username or password. Try again.')
      }
    } catch {
      if (await devLoginFallback(username, password)) {
        onUnlock()
      } else {
        setError('Could not reach the authentication service. Try again in a moment.')
      }
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="portal-auth">
      <form className="portal-auth-card" onSubmit={submit}>
        <span className="portal-lock-mark">
          <Icon name="shield" size={24} />
        </span>
        <p className="portal-kicker">Private portal</p>
        <h1>Sign in to continue</h1>
        <div className="portal-form">
          <input
            className="portal-input"
            type="text"
            autoFocus
            autoComplete="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-label="Username"
          />
          <input
            className="portal-input"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
          />

          {error && <p className="portal-error">{error}</p>}

          <button type="submit" className="portal-submit" disabled={checking}>
            {checking ? 'Checking…' : 'Unlock'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Launcher({ onSelect, onLock }: { onSelect: (view: View) => void; onLock: () => void }) {
  return (
    <div className="portal-screen">
      <header className="portal-bar">
        <span className="portal-brand">
          <span className="portal-mark">
            <Icon name="hub" size={16} />
          </span>
          Portal
        </span>
        <div className="portal-bar-actions">
          <button type="button" className="portal-link-btn" onClick={onLock}>
            Lock
          </button>
        </div>
      </header>

      <main className="portal-launcher-main">
        <p className="portal-kicker">Console</p>
        <h1>Choose a workspace</h1>
        <p className="portal-launcher-sub">
          Two private surfaces, one door. Open the Magnus showcase or step over to the Thallo
          clinical workspace.
        </p>

        <div className="portal-choice-grid">
          <button type="button" className="portal-choice portal-magnus" onClick={() => onSelect('magnus')}>
            <span className="portal-choice-icon">
              <Icon name="hub" size={26} />
            </span>
            <h2>Magnus</h2>
            <p>The private multi-agent AI operating system — the interactive showcase across the Mac estate, Home Assistant, and the operations layer.</p>
            <span className="portal-choice-go">Open showcase →</span>
          </button>

          <button type="button" className="portal-choice portal-thallo" onClick={() => onSelect('thallo')}>
            <span className="portal-choice-icon">
              <Icon name="shield" size={26} />
            </span>
            <h2>Thallo</h2>
            <p>The clinical workspace — read-only patient database access through the secured server-side proxy.</p>
            <span className="portal-choice-go">Open database →</span>
          </button>
        </div>
      </main>

      <footer className="portal-foot">
        <p>Private portal</p>
      </footer>
    </div>
  )
}

export default function Portal() {
  const [initialising, setInitialising] = useState(true)
  const [unlocked, setUnlocked] = useState(false)
  const [view, setView] = useState<View>('launcher')

  useEffect(() => {
    let cancelled = false
    authStatus().then((authenticated) => {
      if (!cancelled) {
        setUnlocked(authenticated)
        setInitialising(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const unlock = () => {
    setUnlocked(true)
    setView('launcher')
  }

  const lock = () => {
    void fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
      setUnlocked(false)
      setView('launcher')
    })
  }

  if (initialising) {
    return (
      <div className="portal-auth">
        <div className="portal-auth-card">
          <span className="portal-lock-mark">
            <Icon name="shield" size={24} />
          </span>
          <p className="portal-kicker">Private portal</p>
          <h1>Checking access…</h1>
        </div>
      </div>
    )
  }

  if (!unlocked) return <Login onUnlock={unlock} />
  if (view === 'thallo') return <Thallo onBack={() => setView('launcher')} onLock={lock} />
  if (view === 'launcher') return <Launcher onSelect={setView} onLock={lock} />

  return (
    <>
      <App />
      <div className="portal-dock">
        <button type="button" className="portal-dock-btn" onClick={() => setView('launcher')}>
          <Icon name="hub" size={16} />
          Launcher
        </button>
        <button type="button" className="portal-dock-btn ghost" onClick={lock}>
          Lock
        </button>
      </div>
    </>
  )
}
