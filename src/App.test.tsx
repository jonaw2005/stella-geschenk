import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
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

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('begrüßt mit dem neuen Abenteuer-Motto', async () => {
    render(<App />)

    await waitFor(() => expect(screen.getByText('Unser Abenteuer')).toBeInTheDocument())
    expect(screen.getByText('DT')).toHaveClass('brand-mark')
    expect(screen.getByText('Dein Reise-Gutschein')).toBeInTheDocument()
    expect(screen.getByText(/Dich erwarten Sonne, neue Orte und ein Reiseziel/)).toBeInTheDocument()
    expect(screen.getByText('Sonne.')).toBeInTheDocument()
    const logout = screen.getByRole('button', { name: 'Abmelden' })
    expect(logout).toHaveAttribute('type', 'submit')
    expect(logout.closest('form')).toHaveAttribute('action', '/logout')
    expect(logout.closest('form')).toHaveAttribute('method', 'post')
    expect(screen.queryByText(/Wir zwei/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Ein Geschenk für dich|Zeit zusammen/i)).not.toBeInTheDocument()
  })

  it('zeigt auf der rechten Bildaktion das nächste Motiv', async () => {
    render(<App />)
    await waitFor(() => expect(screen.getByRole('button', { name: /Reiseziele entdecken/i })).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: /Reiseziele entdecken/i }))
    expect(await screen.findByAltText(/Kos: Gegend Foto 1/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Aktivitäten' })).toBeInTheDocument()
    expect(screen.getByText('Kos-Stadt und Hafen zu Fuß entdecken')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Unterkunft' })).toBeInTheDocument()
    expect(screen.getByText(/Koala Hotel\. Doppelzimmer für zwei/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Nächstes Bild von Kos/i }))
    expect(screen.getByAltText(/Kos: Gegend Foto 2/i)).toBeInTheDocument()
  })
})