import { useState } from 'react'
import { CANDIDATES } from '../types'
import { useVoteStore } from '../store/voteStore'
import DonutChart from '../components/DonutChart'

const AUDIT_LOG_LIMIT = 20

export default function AdminDashboard() {
  const votes = useVoteStore((s) => s.votes)
  const votedSet = useVoteStore((s) => s.votedSet)
  const voteLog = useVoteStore((s) => s.voteLog)
  const resetVotes = useVoteStore((s) => s.resetVotes)
  const [howItWorksOpen, setHowItWorksOpen] = useState(false)

  const totalVotes = Object.values(votes).reduce((sum, n) => sum + n, 0)

  const sortedCandidates = [...CANDIDATES].sort(
    (a, b) => (votes[b.id] || 0) - (votes[a.id] || 0)
  )

  const leader = totalVotes > 0 ? sortedCandidates[0] : null

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all votes? This cannot be undone.')) {
      resetVotes()
    }
  }

  const recentLog = [...voteLog].reverse().slice(0, AUDIT_LOG_LIMIT)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 animate-page-enter">
      <div className="mb-8">
        <h1 className="font-heading text-3xl" style={{ color: 'var(--color-text-primary)' }}>
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          General Election 2026 — Live Results
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div
          className="rounded-xl border p-4"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
            Total Votes
          </p>
          <p className="mt-1 font-heading text-2xl" style={{ color: 'var(--color-teal)' }}>
            {totalVotes}
          </p>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
            Unique Voters (Set)
          </p>
          <p className="mt-1 font-heading text-2xl" style={{ color: 'var(--color-text-primary)' }}>
            {votedSet.size}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            duplicates blocked by Set
          </p>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
            Current Leader
          </p>
          <p className="mt-1 font-heading text-2xl" style={{ color: 'var(--color-text-primary)' }}>
            {leader && (votes[leader.id] || 0) > 0 ? leader.name : '—'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div
            className="rounded-xl border p-6"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <h2 className="mb-6 font-heading text-xl" style={{ color: 'var(--color-text-primary)' }}>
              Live Vote Tally
            </h2>
            <div className="space-y-6">
              {sortedCandidates.map((candidate, index) => {
                const count = votes[candidate.id] || 0
                const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0
                const isLeading = index === 0 && count > 0

                return (
                  <div key={candidate.id}>
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                        style={{ backgroundColor: `${candidate.color}22`, color: candidate.color }}
                      >
                        {candidate.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                            {candidate.name}
                          </span>
                          {isLeading && (
                            <span
                              className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                              style={{ backgroundColor: `${candidate.color}22`, color: candidate.color }}
                            >
                              LEADING
                            </span>
                          )}
                        </div>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {candidate.party}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-heading text-2xl" style={{ color: candidate.color }}>
                          {count}
                        </span>
                        <span className="ml-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div
                      className="h-2 overflow-hidden rounded-full"
                      style={{ backgroundColor: 'var(--color-border)' }}
                    >
                      <div
                        className="progress-bar h-full rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: candidate.color,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div
            className="rounded-xl border p-6"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <h2 className="mb-4 font-heading text-lg" style={{ color: 'var(--color-text-primary)' }}>
              Vote Distribution
            </h2>
            <DonutChart votes={votes} total={totalVotes} />
          </div>

          <div
            className="rounded-xl border p-6"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <h2 className="mb-4 font-heading text-lg" style={{ color: 'var(--color-text-primary)' }}>
              Voter Audit Log
            </h2>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {recentLog.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  No votes recorded yet.
                </p>
              ) : (
                recentLog.map((entry, i) => {
                  const candidate = CANDIDATES.find((c) => c.id === entry.candidateId)
                  const firstName = candidate?.name.split(' ')[0] || 'Unknown'
                  return (
                    <div
                      key={`${entry.voterId}-${entry.timestamp}-${i}`}
                      className="flex flex-wrap items-center gap-2 text-sm"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      <span className="font-mono" style={{ color: 'var(--color-teal)' }}>
                        {entry.voterId}
                      </span>
                      <span>→</span>
                      <span style={{ color: candidate?.color || 'var(--color-text-primary)' }}>
                        {firstName}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          <div
            className="rounded-xl border p-6"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'rgba(239, 68, 68, 0.3)',
            }}
          >
            <h2 className="mb-2 font-heading text-lg" style={{ color: 'var(--color-red)' }}>
              Danger Zone
            </h2>
            <p className="mb-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Permanently clear all vote data and audit logs.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-lg py-2.5 font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--color-red)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
              aria-label="Reset all votes"
            >
              🗑 Reset All Votes
            </button>
          </div>
        </div>
      </div>

      {/* <div className="mt-8">
        <button
          type="button"
          onClick={() => setHowItWorksOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          aria-expanded={howItWorksOpen}
        >
          <span className="font-heading text-lg" style={{ color: 'var(--color-text-primary)' }}>
            How it works
          </span>
          <span style={{ color: 'var(--color-text-muted)' }}>{howItWorksOpen ? '▲' : '▼'}</span>
        </button>

        {howItWorksOpen && (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              className="rounded-xl border-l-4 p-5"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                borderLeftColor: 'var(--color-teal)',
              }}
            >
              <h3 className="font-heading text-lg" style={{ color: 'var(--color-teal)' }}>
                Set (votedSet)
              </h3>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Prevents duplicate votes by tracking every voter ID that has already cast a ballot.
              </p>
              <ul className="mt-3 space-y-1 font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <li>O(1) lookup</li>
                <li>votedSet.has(id) checked before every vote</li>
                <li>Current size: {votedSet.size}</li>
              </ul>
            </div>
            <div
              className="rounded-xl border-l-4 p-5"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                borderLeftColor: 'var(--color-orange)',
              }}
            >
              <h3 className="font-heading text-lg" style={{ color: 'var(--color-orange)' }}>
                VoteQueue
              </h3>
              <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Votes are enqueued before being committed to simulate real-world async processing.
              </p>
              <ul className="mt-3 space-y-1 font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <li>Simulates async processing</li>
                <li>Each vote is dequeued and validated</li>
                <li>Queue drains after ~1.8s</li>
              </ul>
            </div>
          </div>
        )}
      </div> */}
    </div>
  )
}
