import { CANDIDATES } from '../types'

const SIZE = 160
const STROKE = 24
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function DonutChart({ votes, total }) {
  let offset = 0

  const segments = CANDIDATES.map((candidate) => {
    const count = votes[candidate.id] || 0
    const share = total > 0 ? count / total : 0
    const dash = share * CIRCUMFERENCE
    const segment = {
      candidate,
      dash,
      gap: CIRCUMFERENCE - dash,
      offset: -offset,
    }
    offset += dash
    return segment
  })

  return (
    <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={STROKE}
        />
        {segments.map(({ candidate, dash, gap, offset: segOffset }) => (
          <circle
            key={candidate.id}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={candidate.color}
            strokeWidth={STROKE}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={segOffset}
            strokeLinecap="butt"
            className="donut-segment"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-2xl" style={{ color: 'var(--color-text-primary)' }}>
          {total}
        </span>
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          total votes
        </span>
      </div>
    </div>
  )
}
