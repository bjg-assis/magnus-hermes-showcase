import { useEffect, useMemo, useRef, useState } from 'react'
import { DEMO_STEPS, EDGES, NODES } from '../data'
import type { MapNode, NodeId } from '../data'
import { Icon } from './Icon'

const ACCENT_HEX = {
  cyan: '#0071e3',
  amber: '#c93400',
  green: '#248a3d',
  rose: '#d6336c',
  ice: '#2997ff',
} as const

const MAGNUS_SATELLITE_ANGLES: Record<string, number> = {
  boris: -162,
  sterling: -112,
  professor: -62,
  surgeons: -12,
  aegis: 38,
}

const BORIS_SKILL_ANGLES: Record<string, number> = {
  aiworker: 215,
  orcaforge: 145,
}

const ORBIT_R = 126
const BORIS_SKILL_ORBIT_R = 54
const HUB = { x: 500, y: 330 }

const pointOnOrbit = (origin: { x: number; y: number }, radius: number, angleDeg: number) => {
  const angle = (angleDeg * Math.PI) / 180
  return {
    x: origin.x + radius * Math.cos(angle),
    y: origin.y + radius * Math.sin(angle),
  }
}

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
  const magnusSatellites = useMemo(() => NODES.filter((n) => n.satellite && n.id in MAGNUS_SATELLITE_ANGLES), [])
  const borisSkillNodes = useMemo(() => NODES.filter((n) => n.satellite && n.id in BORIS_SKILL_ANGLES), [])
  const borisPoint = pointOnOrbit(HUB, ORBIT_R, MAGNUS_SATELLITE_ANGLES.boris)

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
        aria-label="Interactive map of the Magnus multiagent network"
      >
        <defs>
          <radialGradient id="hub-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0071e3" stopOpacity="0.08" />
            <stop offset="60%" stopColor="#0071e3" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#0071e3" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="edge-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0071e3" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#2997ff" stopOpacity="0.45" />
          </linearGradient>
          <filter id="node-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#000000" floodOpacity="0.12" />
          </filter>
          <clipPath id="obsidian-clip">
            <circle cx="268" cy="548" r="42" />
          </clipPath>
        </defs>

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
          {magnusSatellites.map((n) => {
            const { x: sx, y: sy } = pointOnOrbit(HUB, ORBIT_R, MAGNUS_SATELLITE_ANGLES[n.id])
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

        {/* Boris-linked builder skills */}
        <circle
          cx={borisPoint.x}
          cy={borisPoint.y}
          r={BORIS_SKILL_ORBIT_R}
          className="orbit-ring skill-orbit-ring"
          aria-hidden="true"
        />
        <g className="skill-link-group" aria-hidden="true">
          {borisSkillNodes.map((n) => {
            const { x: sx, y: sy } = pointOnOrbit(borisPoint, BORIS_SKILL_ORBIT_R, BORIS_SKILL_ANGLES[n.id])
            return <line key={n.id} x1={borisPoint.x} y1={borisPoint.y} x2={sx} y2={sy} className="skill-link" />
          })}
        </g>
        <g className="orbit-group skill-orbit-group">
          {borisSkillNodes.map((n) => {
            const { x: sx, y: sy } = pointOnOrbit(borisPoint, BORIS_SKILL_ORBIT_R, BORIS_SKILL_ANGLES[n.id])
            return (
              <SatelliteNode
                key={n.id}
                node={n}
                x={sx}
                y={sy}
                selected={selected === n.id}
                dim={isDim(n.id)}
                onSelect={onSelect}
                compact
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
      <circle cx={node.x} cy={node.y} r={node.r} className="node-core" filter="url(#node-shadow)" />
      {node.id === 'obsidian' ? (
        <image
          href="/assets/obsidian-graph.jpg"
          x={node.x - node.r}
          y={node.y - node.r}
          width={node.r * 2}
          height={node.r * 2}
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#obsidian-clip)"
          className="obsidian-node-image"
        />
      ) : (
        <g transform={`translate(${node.x - 15}, ${node.y - 15})`} className="node-icon">
          <Icon name={node.icon} size={30} />
        </g>
      )}
      <circle cx={node.x} cy={node.y} r={node.r} className="node-rim" />
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
  compact = false,
  onSelect,
}: {
  node: MapNode
  x: number
  y: number
  selected: boolean
  dim: boolean
  compact?: boolean
  onSelect: (id: NodeId) => void
}) {
  const hex = ACCENT_HEX[node.accent]
  const iconSize = compact ? 14 : 18
  const iconOffset = iconSize / 2
  return (
    <g
      className={`node satellite ${compact ? 'skill-node' : ''} ${selected ? 'selected' : ''} ${dim ? 'dim' : ''}`}
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
      <circle cx={x} cy={y} r={node.r} className="node-core" filter="url(#node-shadow)" />
      <circle cx={x} cy={y} r={node.r} className="node-rim" />
      <g transform={`translate(${x - iconOffset}, ${y - iconOffset})`} className="node-icon">
        <Icon name={node.icon} size={iconSize} />
      </g>
      <text x={x} y={y - node.r - 8} className="node-name small">
        {node.name}
      </text>
    </g>
  )
}
