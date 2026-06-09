import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute({ children, requiredRole }) {
  const currentUser = useAuthStore((s) => s.currentUser)

  if (!currentUser) {
    return <Navigate to="/" replace />
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}
