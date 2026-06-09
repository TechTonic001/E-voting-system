import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const [mode, setMode] = useState('voter')
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (mode === 'admin') {
      if (userId === 'admin' && password === 'admin123') {
        login({ id: 'admin', role: 'admin' })
        navigate('/admin')
        return
      }
      setError('Invalid admin credentials. Use admin / admin123')
      return
    }

    if (!userId.trim()) {
      setError('Please enter a Voter ID')
      return
    }

    if (password !== 'vote2026') {
      setError('Invalid password. Use vote2026 for demo access')
      return
    }

    login({ id: userId.trim(), role: 'voter' })
    navigate('/voter', { state: { voterId: userId.trim() } })
  }

  return (
    <div
      className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-12 animate-page-enter"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div
        className="w-full max-w-[440px] rounded-2xl border p-6 shadow-xl sm:p-8"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="mb-6 text-center">
          
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Secure E-Voting Platform
          </p>
        </div>

        <div
          className="mb-6 flex rounded-lg p-1"
          style={{ backgroundColor: 'var(--color-surface-elevated)' }}
          role="tablist"
          aria-label="Login mode"
        >
          {['voter', 'admin'].map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m)
                setError('')
              }}
              className="flex-1 rounded-md py-2 text-sm font-medium capitalize transition-colors"
              style={{
                backgroundColor: mode === m ? 'var(--color-surface)' : 'transparent',
                color: mode === m ? 'var(--color-teal)' : 'var(--color-text-muted)',
              }}
            >
              {m}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="userId"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {mode === 'admin' ? 'Username' : 'Voter ID'}
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full rounded-lg border px-4 py-2.5 outline-none transition-colors focus:ring-2"
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
              placeholder={mode === 'admin' ? 'admin' : 'e.g. V-1042'}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-4 py-2.5 outline-none transition-colors focus:ring-2"
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: 'var(--color-red)' }} role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg py-3 font-semibold transition-opacity hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-teal)',
              color: '#09090f',
            }}
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {mode === 'admin' ? (
            <>
              Demo: <code className="rounded px-1.5 py-0.5" style={{ backgroundColor: 'var(--color-bg)' }}>admin</code>{' '}
              / <code className="rounded px-1.5 py-0.5" style={{ backgroundColor: 'var(--color-bg)' }}>admin123</code>
            </>
          ) : (
            <>
              Demo: any Voter ID + password{' '}
              <code className="rounded px-1.5 py-0.5" style={{ backgroundColor: 'var(--color-bg)' }}>vote2026</code>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
