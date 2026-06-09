import { create } from 'zustand'
import { CANDIDATES } from '../types'

export class VoteQueue {
  constructor() {
    this.items = []
  }

  enqueue(item) {
    this.items.push(item)
  }

  dequeue() {
    return this.items.shift()
  }

  isEmpty() {
    return this.items.length === 0
  }

  size() {
    return this.items.length
  }

  clear() {
    this.items = []
  }
}

const voteQueue = new VoteQueue()
let drainTimeout = null

const initialVotes = Object.fromEntries(CANDIDATES.map((c) => [c.id, 0]))

export const useVoteStore = create((set, get) => ({
  votes: { ...initialVotes },
  votedSet: new Set(),
  voteLog: [],
  processing: false,
  queueSize: 0,

  castVote: (voterId, candidateId) => {
    const { votedSet } = get()
    if (votedSet.has(voterId)) return

    voteQueue.enqueue({
      voterId,
      candidateId,
      timestamp: new Date().toISOString(),
    })

    set({ processing: true, queueSize: voteQueue.size() })

    if (drainTimeout) clearTimeout(drainTimeout)

    drainTimeout = setTimeout(() => {
      const state = get()
      const newVotedSet = new Set(state.votedSet)
      const newVotes = { ...state.votes }
      const newVoteLog = [...state.voteLog]

      while (!voteQueue.isEmpty()) {
        const entry = voteQueue.dequeue()
        if (!newVotedSet.has(entry.voterId)) {
          newVotedSet.add(entry.voterId)
          newVotes[entry.candidateId] = (newVotes[entry.candidateId] || 0) + 1
          newVoteLog.push(entry)
        }
      }

      set({
        votedSet: newVotedSet,
        votes: newVotes,
        voteLog: newVoteLog,
        processing: false,
        queueSize: 0,
      })
      drainTimeout = null
    }, 1800)
  },

  resetVotes: () => {
    voteQueue.clear()
    if (drainTimeout) {
      clearTimeout(drainTimeout)
      drainTimeout = null
    }
    set({
      votes: { ...initialVotes },
      votedSet: new Set(),
      voteLog: [],
      processing: false,
      queueSize: 0,
    })
  },

  getQueueSize: () => voteQueue.size(),
}))
