export type Decision = 'unseen' | 'liked' | 'passed'

export interface Destination {
  id: string
  title: string
  country: string
  teaser: string
  description: string
  tags: string[]
  images: { src: string; alt: string }[]
  seaIdeas: string[]
  cultureIdeas: string[]
  planningNote: string
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