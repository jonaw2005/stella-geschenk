export type Decision = 'unseen' | 'liked' | 'passed'

export interface Destination {
  id: string
  title: string
  country: string
  teaser: string
  description: string
  tags: string[]
  duration: string
  travelTime: string
  originNote: string
  images: { src: string; alt: string; sourceUrl: string; label: string; kind: 'place' | 'accommodation' }[]
  activities: string[]
  accommodations: { label: string; text: string; url: string | null }[]
  foodSpots: { label: string; text: string; url: string | null }[]
  planningNote: string
  budgetNote: string
  officialUrl: string | null
}

export interface SelectionState {
  decisions: Record<string, Decision>
  updatedAt: string
}

export const createInitialState = (ids: string[]): SelectionState => ({
  decisions: Object.fromEntries(ids.map((id) => [id, 'unseen'])),
  updatedAt: new Date(0).toISOString(),
})

export const applyDecision = (
  state: SelectionState,
  id: string,
  decision: Exclude<Decision, 'unseen'>,
): SelectionState => {
  if (state.decisions[id] === decision) return state
  return {
    decisions: { ...state.decisions, [id]: decision },
    updatedAt: new Date().toISOString(),
  }
}

export const progress = (state: SelectionState) =>
  Object.values(state.decisions).filter((decision) => decision !== 'unseen').length