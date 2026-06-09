import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const currentUser = useAuthStore((s) => s.currentUser)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(9, 9, 15, 0.85)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <NavLink to={currentUser ? (currentUser.role === 'admin' ? '/admin' : '/voter') : '/'} className="shrink-0">
          <span className="font-heading text-xl tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
            VOTE<span style={{ color: 'var(--color-teal)' }}></span>
          </span>
        </NavLink>

        {currentUser && (
          <div className="flex items-center gap-1 rounded-lg p-1" style={{ backgroundColor: 'var(--color-surface)' }}>
            <NavLink
              to="/voter"
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm transition-colors sm:px-4 ${
                  isActive ? 'font-medium' : ''
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'var(--color-surface-elevated)' : 'transparent',
                color: isActive ? 'var(--color-teal)' : 'var(--color-text-secondary)',
              })}
              aria-label="Voter dashboard"
            >
              <span className="sm:hidden" aria-hidden="true">
                🗳
              </span>
              <span className="hidden sm:inline">🗳 Online-Voting</span>
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm transition-colors sm:px-4 ${
                  isActive ? 'font-medium' : ''
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'var(--color-surface-elevated)' : 'transparent',
                color: isActive ? 'var(--color-teal)' : 'var(--color-text-secondary)',
              })}
              aria-label="Admin dashboard"
            >
              <span className="sm:hidden" aria-hidden="true">
                📊
              </span>
              <span className="hidden sm:inline">📊 Admin</span>
            </NavLink>
          </div>
        )}

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <span
              className="inline-block h-2 w-2 rounded-full animate-pulse-dot"
              style={{ backgroundColor: 'var(--color-green)' }}
            />
            <span className="hidden sm:inline">Election Open</span>
          </div>
          {currentUser && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border px-3 py-1.5 text-sm transition-colors hover:opacity-90"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
              aria-label="Log out"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
