/**
 * @typedef {Object} Candidate
 * @property {string} id
 * @property {string} name
 * @property {string} party
 * @property {string} color
 * @property {string} avatar
 */

/**
 * @typedef {Object} VoteEntry
 * @property {string} voterId
 * @property {string} candidateId
 * @property {string} timestamp
 */

/**
 * @typedef {Object} AppState
 * @property {Record<string, number>} votes
 * @property {Set<string>} votedSet
 * @property {VoteEntry[]} voteLog
 * @property {boolean} processing
 */

/** @type {Candidate[]} */
export const CANDIDATES = [
  {
    id: 'C001',
    name: 'Amara Okafor',
    party: 'Progressive Alliance',
    color: '#00d4aa',
    avatar: 'AO',
  },
  {
    id: 'C002',
    name: 'James Whitfield',
    party: 'Unity Coalition',
    color: '#6366f1',
    avatar: 'JW',
  },
  {
    id: 'C003',
    name: 'Sofia Mendez',
    party: 'Green Future',
    color: '#22c55e',
    avatar: 'SM',
  },
  {
    id: 'C004',
    name: 'David Chen',
    party: 'Liberty Front',
    color: '#f97316',
    avatar: 'DC',
  },
]
