import type { SelectionState } from './domain'

const STORAGE_KEY = 'reise-swipe:18-geburtstag:state'
const STATE_ENDPOINT = '/api/state'

function isSelectionState(value: unknown): value is SelectionState {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<SelectionState>
  return Boolean(candidate.decisions && typeof candidate.decisions === 'object' && typeof candidate.updatedAt === 'string')
}

export function loadState(): SelectionState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!isSelectionState(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveState(state: SelectionState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Der aktuelle Tab kann auch ohne dauerhafte Speicherung weiterarbeiten.
  }
}

export async function loadServerState(): Promise<SelectionState | null> {
  const response = await fetch(STATE_ENDPOINT, { credentials: 'same-origin' })
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Serverstand konnte nicht geladen werden (${response.status}).`)
  const parsed: unknown = await response.json()
  if (!isSelectionState(parsed)) throw new Error('Der Serverstand hat ein ungültiges Format.')
  return parsed
}

export async function saveServerState(state: SelectionState): Promise<void> {
  const response = await fetch(STATE_ENDPOINT, {
    method: 'PUT',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  })
  if (!response.ok) throw new Error(`Serverstand konnte nicht gespeichert werden (${response.status}).`)
}

export async function clearServerState(): Promise<void> {
  const response = await fetch(STATE_ENDPOINT, { method: 'DELETE', credentials: 'same-origin' })
  if (!response.ok && response.status !== 404) throw new Error(`Serverstand konnte nicht gelöscht werden (${response.status}).`)
}