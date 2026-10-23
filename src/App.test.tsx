import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'

describe('Swipe-Kartengalerie', () => {
  beforeEach(() => {
    window.location.hash = '#/'
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      if (!init?.method || init.method === 'GET') return new Response('', { status: 404 })
      return new Response(null, { status: 204 })
    }))
  })

  afterEach(() => vi.unstubAllGlobals())

  it('zeigt auf der rechten Bildaktion das nächste Motiv', async () => {
    render(<App />)
    await waitFor(() => expect(screen.getByRole('button', { name: /Reiseziele entdecken/i })).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: /Reiseziele entdecken/i }))
    expect(await screen.findByAltText(/Küstenlandschaft von Kos/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Nächstes Bild von Kos/i }))
    expect(screen.getByAltText(/Bucht auf Kos/i)).toBeInTheDocument()
  })
})