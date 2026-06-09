import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { CANDIDATES } from '../types'
import { useVoteStore } from '../store/voteStore'
import { useAuthStore } from '../store/authStore'

export default function VoterDashboard() {
  const location = useLocation()
  const currentUser = useAuthStore((s) => s.currentUser)
  const selectedCandidate = useAuthStore((s) => s.selectedCandidate)
  const setSelectedCandidate = useAuthStore((s) => s.setSelectedCandidate)

  const votes = useVoteStore((s) => s.votes)
  const votedSet = useVoteStore((s) => s.votedSet)
  const voteLog = useVoteStore((s) => s.voteLog)
  const processing = useVoteStore((s) => s.processing)
  const queueSize = useVoteStore((s) => s.queueSize)
  const castVote = useVoteStore((s) => s.castVote)

  const voterId = location.state?.voterId || currentUser?.id

  useEffect(() => {
    if (!voterId) return
    if (votedSet.has(voterId)) {
      const entry = [...voteLog].reverse().find((v) => v.voterId === voterId)
      if (entry) setSelectedCandidate(entry.candidateId)
    }
  }, [voterId, votedSet, voteLog, setSelectedCandidate])

  if (!voterId) {
    return <Navigate to="/" replace />
  }

  const hasVoted = votedSet.has(voterId)
  const totalVotes = Object.values(votes).reduce((sum, n) => sum + n, 0)
  const votedEntry = [...voteLog].reverse().find((v) => v.voterId === voterId)
  const votedCandidate = votedEntry
    ? CANDIDATES.find((c) => c.id === votedEntry.candidateId)
    : null

  const handleCastVote = () => {
    if (!selectedCandidate || processing || hasVoted) return
    castVote(voterId, selectedCandidate)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 animate-page-enter">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-3xl" style={{ color: 'var(--color-text-primary)' }}>
            Online_Voting Dashboard
          </h1>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: 'var(--color-green)' }}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full animate-pulse-dot" style={{ backgroundColor: 'var(--color-green)' }} />
            Live
          </span>
        </div>
        <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Voter ID: <span className="font-mono" style={{ color: 'var(--color-teal)' }}>{voterId}</span>
          {' · '}
          General Election 2026
        </p>
      </div>

      {processing && (
        <div
          className="mb-6 flex items-center gap-3 rounded-xl border px-4 py-3"
          style={{
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            borderColor: 'rgba(249, 115, 22, 0.3)',
            color: 'var(--color-orange)',
          }}
          role="status"
        >
          <span
            className="inline-block h-5 w-5 rounded-full border-2 border-t-transparent animate-spin-border"
            style={{ borderColor: 'var(--color-orange)', borderTopColor: 'transparent' }}
          />
          Processing your vote… ({queueSize} in queue)
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Total Votes Cast" value={totalVotes} />
        <StatCard label="Unique Voters" value={votedSet.size} />
        <div
          className="rounded-xl border p-4"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
            Your Status
          </p>
          {hasVoted ? (
            <div className="mt-1">
              <p className="font-semibold" style={{ color: 'var(--color-green)' }}>
                ✓ Vote Recorded
              </p>
              {votedCandidate && (
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  Voted for {votedCandidate.name}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-1 font-semibold" style={{ color: 'var(--color-orange)' }}>
              Pending
            </p>
          )}
        </div>
      </div>

      <div
        className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2"
        role="radiogroup"
        aria-label="Select a candidate to vote for"
      >
        {CANDIDATES.map((candidate) => {
          const isSelected = selectedCandidate === candidate.id
          const disabled = hasVoted || processing

          return (
            <button
              key={candidate.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${candidate.name}, ${candidate.party}`}
              disabled={disabled}
              onClick={() => !disabled && setSelectedCandidate(candidate.id)}
              className="candidate-card rounded-xl border-2 p-5 text-left disabled:cursor-not-allowed disabled:opacity-70"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: isSelected ? candidate.color : 'var(--color-border)',
                boxShadow: isSelected ? `0 0 0 1px ${candidate.color}33` : 'none',
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                  style={{ backgroundColor: `${candidate.color}22`, color: candidate.color }}
                >
                  {candidate.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {candidate.name}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {candidate.party}
                  </p>
                  <p className="mt-1 font-mono text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {candidate.id}
                  </p>
                  {hasVoted && (
                    <p className="mt-2 text-sm font-medium" style={{ color: candidate.color }}>
                      {votes[candidate.id]} vote{votes[candidate.id] !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex justify-center">
        {hasVoted ? (
          <div
            className="rounded-xl px-6 py-3 text-sm font-medium"
            style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: 'var(--color-green)' }}
          >
            ✅ Your vote has been recorded and verified
          </div>
        ) : (
          <button
            type="button"
            onClick={handleCastVote}
            disabled={!selectedCandidate || processing}
            className="rounded-xl px-8 py-3 font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-teal)', color: '#09090f' }}
          >
            Cast My Vote →
          </button>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </p>
      <p className="mt-1 font-heading text-2xl" style={{ color: 'var(--color-text-primary)' }}>
        {value}
      </p>
    </div>
  )
}
