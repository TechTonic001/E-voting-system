import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  currentUser: null,
  selectedCandidate: null,

  login: (user) => set({ currentUser: user }),

  logout: () => set({ currentUser: null, selectedCandidate: null }),

  setSelectedCandidate: (candidateId) => set({ selectedCandidate: candidateId }),

  clearSelectedCandidate: () => set({ selectedCandidate: null }),
}))
