import { describe, expect, it, vi } from 'vitest'
import { applyDecision, createInitialState, progress } from './domain'

describe('Auswahlzustand', () => {
  it('zählt Likes und Ablehnungen als bewertete Ziele', () => {
    vi.setSystemTime(new Date('2026-10-23T12:00:00Z'))
    let state = createInitialState(['kos', 'malta', 'valencia'])
    state = applyDecision(state, 'kos', 'liked')
    state = applyDecision(state, 'malta', 'passed')
    expect(progress(state)).toBe(2)
  })

  it('erzeugt bei identischer Entscheidung keinen neuen Zustand', () => {
    const liked = applyDecision(createInitialState(['kos']), 'kos', 'liked')
    expect(applyDecision(liked, 'kos', 'liked')).toBe(liked)
  })
})