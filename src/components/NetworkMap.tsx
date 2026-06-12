import { useEffect, useMemo, useRef, useState } from 'react'
import { DEMO_STEPS, EDGES, NODES } from '../data'
import type { MapNode, NodeId } from '../data'
import { Icon } from './Icon'

const ACCENT_HEX = {
  cyan: '#36e0e8',
  amber: '#ffc25e',
  green: '#5ef0a8',
  rose: '#ff9ec6',
  ice: '#9ad2ff',
} as const

const SATELLITE_ANGLES: Record<string, number> = {
  boris: -150,
  sterling: -90,
  professor: -30,
}

const ORBIT_R = 104
const HUB = { x: 500, y: 330 }

interface Props {
  selected: NodeId
  onSelect: (id: NodeId) => void
}

export function NetworkMap({ selected, onSelect }: Props) {
  const [demoStep, setDemoStep] = useState(-1)
  const timerRef = useRef<number | null>(null)

  const demoRunning = demoStep >= 0 && demoStep < DEMO_STEPS.length
  const step = demoRunning ? DEMO_STEPS[demoStep] : null

  useEffect(() => {
    if (!demoRunning) return
    timerRef.current = window.setTimeout(() => {
      setDemoStep((s) => (s + 1 >= DEMO_STEPS.length ? -1 : s + 1))
    }, 2600)
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [demoStep, demoRunning])

  const startDemo = () => setDemoStep(0)
  const stopDemo = () => setDemoStep(-1)

  const mainNodes = useMemo(() => NODES.filter((n) => !n.satellite), [])
  const satellites = useMemo(() => NODES.filter((n) => n.satellite), [])

  const isDim = (id: NodeId) => demoRunning && step !== null && !step.highlight.includes(id)

  return (
    <div className="map-wrap">
      <div className="map-toolbar">
        <button
          type="button"
          className={`demo-btn ${demoRunning ? 'running' : ''}`}
          onClick={demoRunning ? stopDemo : startDemo}
          aria-pressed={demoRunning}
        >
          <span className="demo-dot" aria-hidden="true" />
          {demoRunning ? 'Stop the journey' : 'Follow a request'}
        </button>
        <p className="map-hint">Tap any star to learn its story</p>
      </div>

      <div className={`demo-banner ${step ? 'show' : ''}`} aria-live="polite">
        {step && (
          <>
            <span className="demo-step-num">
              {demoStep + 1} / {DEMO_STEPS.length}
            </span>
            <span className="demo-caption">{step.caption}</span>
            <span className="demo-detail">{step.detail}</span>
          </>
        )}
      </div>

      <svg
        className="map-svg"
        viewBox="0 0 1000 650"
        role="group"
        aria-label="Interactive map of the Magnus and Hermes network"
      >
        <defs>
          <radialGradient id="hub-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#36e0e8" stopOpacity="0.32" />
            <stop offset="60%" stopColor="#36e0e8" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#36e0e8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="edge-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#36e0e8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#9ad2ff" stopOpacity="0.55" />
          </linearGradient>
          <filter id="node-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ambient star field */}
        <g className="starfield" aria-hidden="true">
          {STARS.map((s, i) => (
            <circle key={i} cx={s[0]} cy={s[1]} r={s[2]} className="bg-star" style={{ animationDelay: `${s[3]}s` }} />
          ))}
        </g>

        <circle cx={HUB.x} cy={HUB.y} r="190" fill="url(#hub-halo)" aria-hidden="true" />

        {/* connections */}
        <g aria-hidden="true">
          {EDGES.map((e) => {
            const active = demoRunning && step?.edgeId === e.id
            return (
              <g key={e.id} className={`edge ${e.tailscale ? 'tailscale' : ''} ${active ? 'active' : ''}`}>
                {e.tailscale && <path d={e.path} className="edge-tunnel" />}
                <path d={e.path} className="edge-base" />
                <path d={e.path} className="edge-flow" />
              </g>
            )
          })}
        </g>

        {/* tailscale tunnel labels */}
        <g aria-hidden="true" className="tunnel-labels">
          <text x="688" y="232" className="tunnel-label" transform="rotate(-17 688 232)">
            tailscale · secure tunnel
          </text>
          <text x="676" y="436" className="tunnel-label" transform="rotate(17 676 436)">
            tailscale · secure tunnel
          </text>
        </g>

        {/* orbit ring + standby satellites around Magnus */}
        <circle cx={HUB.x} cy={HUB.y} r={ORBIT_R} className="orbit-ring" aria-hidden="true" />
        <g className="orbit-group">
          {satellites.map((n) => {
            const angle = (SATELLITE_ANGLES[n.id] * Math.PI) / 180
            const sx = HUB.x + ORBIT_R * Math.cos(angle)
            const sy = HUB.y + ORBIT_R * Math.sin(angle)
            return (
              <SatelliteNode
                key={n.id}
                node={n}
                x={sx}
                y={sy}
                selected={selected === n.id}
                dim={isDim(n.id)}
                onSelect={onSelect}
              />
            )
          })}
        </g>

        {/* demo pulse */}
        {step?.path && (
          <circle key={demoStep} r="7" className="demo-pulse" aria-hidden="true">
            <animateMotion dur="1.9s" fill="freeze" path={step.path} keyPoints="0;1" keyTimes="0;1" />
          </circle>
        )}

        {/* main nodes */}
        {mainNodes.map((n) => (
          <StarNode
            key={n.id}
            node={n}
            selected={selected === n.id}
            dim={isDim(n.id)}
            pulsing={demoRunning && step !== null && step.highlight.includes(n.id)}
            onSelect={onSelect}
          />
        ))}
      </svg>
    </div>
  )
}

function StarNode({
  node,
  selected,
  dim,
  pulsing,
  onSelect,
}: {
  node: MapNode
  selected: boolean
  dim: boolean
  pulsing: boolean
  onSelect: (id: NodeId) => void
}) {
  const hex = ACCENT_HEX[node.accent]
  const labelY = node.y + node.r + 22
  return (
    <g
      className={`node ${selected ? 'selected' : ''} ${dim ? 'dim' : ''} ${pulsing ? 'pulsing' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`${node.name} — ${node.role}`}
      aria-pressed={selected}
      onClick={() => onSelect(node.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(node.id)
        }
      }}
      style={{ ['--node-accent' as string]: hex }}
    >
      <circle cx={node.x} cy={node.y} r={node.r + 10} className="node-aura" />
      <circle cx={node.x} cy={node.y} r={node.r} className="node-core" filter="url(#node-glow)" />
      <circle cx={node.x} cy={node.y} r={node.r} className="node-rim" />
      <g transform={`translate(${node.x - 15}, ${node.y - 15})`} className="node-icon">
        <Icon name={node.icon} size={30} />
      </g>
      <text x={node.x} y={labelY} className="node-name">
        {node.name}
      </text>
      <text x={node.x} y={labelY + 16} className="node-role">
        {node.role.split('·')[0].trim()}
      </text>
    </g>
  )
}

function SatelliteNode({
  node,
  x,
  y,
  selected,
  dim,
  onSelect,
}: {
  node: MapNode
  x: number
  y: number
  selected: boolean
  dim: boolean
  onSelect: (id: NodeId) => void
}) {
  const hex = ACCENT_HEX[node.accent]
  return (
    <g
      className={`node satellite ${selected ? 'selected' : ''} ${dim ? 'dim' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`${node.name} — ${node.role}`}
      aria-pressed={selected}
      onClick={() => onSelect(node.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(node.id)
        }
      }}
      style={{ ['--node-accent' as string]: hex }}
    >
      <circle cx={x} cy={y} r={node.r + 6} className="node-aura" />
      <circle cx={x} cy={y} r={node.r} className="node-core" />
      <circle cx={x} cy={y} r={node.r} className="node-rim" />
      <g transform={`translate(${x - 9}, ${y - 9})`} className="node-icon">
        <Icon name={node.icon} size={18} />
      </g>
      <text x={x} y={y - node.r - 8} className="node-name small">
        {node.name}
      </text>
    </g>
  )
}

/* fixed pseudo-random star field: [x, y, r, twinkle-delay] */
const STARS: Array<[number, number, number, number]> = [
  [60, 80, 1.4, 0], [180, 150, 1, 1.2], [250, 60, 1.8, 2.1], [340, 200, 1, 0.4],
  [90, 480, 1.3, 1.7], [200, 420, 1, 2.6], [420, 520, 1.2, 0.9], [560, 470, 1, 1.5],
  [620, 120, 1.5, 0.2], [720, 320, 1, 2.3], [760, 80, 1.2, 1.1], [930, 110, 1.6, 0.6],
  [950, 300, 1, 1.9], [900, 560, 1.3, 2.8], [780, 600, 1, 0.8], [640, 620, 1.4, 1.4],
  [380, 90, 1, 3.1], [150, 260, 1.1, 2.0], [40, 600, 1.5, 0.5], [490, 600, 1, 2.4],
  [300, 330, 0.9, 1.0], [580, 220, 0.9, 0.3], [880, 380, 1.1, 1.6], [120, 180, 0.8, 2.9],
]
