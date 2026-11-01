import { useEffect, useMemo, useRef, useState } from 'react'
import { destinations } from './destinations'
import { applyDecision, createInitialState, progress, type Decision, type Destination, type SelectionState } from './domain'
import { clearServerState, clearState, loadServerState, loadState, saveServerState, saveState } from './storage'

type Route = 'home' | 'discover' | 'favorites' | 'info'
type Direction = 'liked' | 'passed'

function readRoute(): Route {
  const route = window.location.hash.replace('#/', '')
  return route === 'entdecken' ? 'discover' : route === 'favoriten' ? 'favorites' : route === 'info' ? 'info' : 'home'
}

function go(route: Route) {
  const paths: Record<Route, string> = { home: '#/', discover: '#/entdecken', favorites: '#/favoriten', info: '#/info' }
  window.location.hash = paths[route]
}

function Icon({ name }: { name: 'compass' | 'heart' | 'info' | 'undo' | 'close' | 'check' | 'arrow' }) {
  const paths = {
    compass: <><circle cx="12" cy="12" r="9"/><path d="m15.2 8.8-2 4.4-4.4 2 2-4.4 4.4-2Z"/></>,
    heart: <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/></>,
    undo: <><path d="M9 7 5 11l4 4"/><path d="M5 11h8a5 5 0 0 1 5 5"/></>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    arrow: <path d="m9 18 6-6-6-6"/>,
  }
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

export function App() {
  const initial = useMemo(() => {
    const empty = createInitialState(destinations.map((destination) => destination.id))
    const stored = loadState()
    return stored ? { ...empty, ...stored, decisions: { ...empty.decisions, ...stored.decisions } } : empty
  }, [])
  const [state, setState] = useState<SelectionState>(initial)
  const [history, setHistory] = useState<SelectionState[]>([])
  const [route, setRoute] = useState<Route>(readRoute)
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [serverReady, setServerReady] = useState(false)
  const [serverSyncError, setServerSyncError] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const onHash = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHash)
    if (!window.location.hash) go('home')
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    let active = true
    loadServerState()
      .then((serverState) => {
        if (!active) return
        if (serverState) {
          const empty = createInitialState(destinations.map((destination) => destination.id))
          const reconciled = { ...empty, ...serverState, decisions: { ...empty.decisions, ...serverState.decisions } }
          setState(reconciled)
          saveState(reconciled)
          return saveServerState(reconciled)
        } else {
          return saveServerState(initial)
        }
      })
      .catch(() => active && setServerSyncError(true))
      .finally(() => active && setServerReady(true))
    return () => { active = false }
  }, [initial])

  const persist = (next: SelectionState) => {
    setStorageAvailable(saveState(next))
    void saveServerState(next)
      .then(() => setServerSyncError(false))
      .catch(() => setServerSyncError(true))
  }

  const decide = (id: string, decision: Direction) => {
    const next = applyDecision(state, id, decision)
    if (next === state) return
    setHistory((items) => [...items.slice(-49), state])
    setState(next)
    persist(next)
    const destination = destinations.find((item) => item.id === id)
    const remaining = destinations.length - progress(next)
    setAnnouncement(`${destination?.title ?? 'Ziel'}: ${decision === 'liked' ? 'Gefällt mir' : 'Eher nicht'}. ${remaining} Ziele verbleiben.`)
  }

  const undo = () => {
    const previous = history.at(-1)
    if (!previous) return
    setHistory((items) => items.slice(0, -1))
    setState(previous)
    persist(previous)
    setAnnouncement('Die letzte Entscheidung wurde rückgängig gemacht.')
  }

  const reset = () => {
    if (!window.confirm('Möchtest du wirklich alle Bewertungen auf diesem Gerät und dem Geschenk-Server löschen?')) return
    const next = createInitialState(destinations.map((destination) => destination.id))
    clearState()
    void clearServerState().catch(() => setServerSyncError(true))
    setState(next)
    setHistory([])
    go('home')
  }

  const favorites = destinations.filter((destination) => state.decisions[destination.id] === 'liked')

  if (!serverReady) {
    return <div className="loading-screen"><span className="brand-mark">W</span><p>Deine Auswahl wird geladen …</p></div>
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Zum Hauptinhalt</a>
      {!storageAvailable && <div className="storage-warning">Nur für diesen geöffneten Tab gespeichert.</div>}
      {serverSyncError && <div className="storage-warning">Server gerade nicht erreichbar – Änderungen bleiben zunächst auf diesem Gerät gespeichert.</div>}
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="topbar">
        <button className="brand" onClick={() => go('home')} aria-label="Zur Begrüßung">
          <span className="brand-mark">W</span>
          <span>Wir zwei</span>
        </button>
        <span className="trip-note">7 Nächte · flexibel</span>
      </header>

      <main id="main">
        {route === 'home' && <Welcome hasProgress={progress(state) > 0} onStart={() => go('discover')} />}
        {route === 'discover' && (
          <Discovery state={state} onDecide={decide} onUndo={undo} canUndo={history.length > 0} />
        )}
        {route === 'favorites' && <Favorites items={favorites} onDiscover={() => go('discover')} onRemove={(id) => decide(id, 'passed')} />}
        {route === 'info' && <Info onReset={reset} />}
      </main>

      {route !== 'home' && (
        <nav className="bottom-nav" aria-label="Hauptnavigation">
          <NavButton active={route === 'discover'} icon="compass" label="Entdecken" onClick={() => go('discover')} />
          <NavButton active={route === 'favorites'} icon="heart" label="Favoriten" badge={favorites.length} onClick={() => go('favorites')} />
          <NavButton active={route === 'info'} icon="info" label="Info" onClick={() => go('info')} />
        </nav>
      )}
      <div className="sr-only" aria-live="polite">{announcement}</div>
    </div>
  )
}

function Welcome({ hasProgress, onStart }: { hasProgress: boolean; onStart: () => void }) {
  return (
    <section className="welcome page-enter" aria-labelledby="welcome-title">
      <div className="eyebrow">Ein Geschenk für dich</div>
      <div className="hero-stamp" aria-hidden="true"><span>18</span><small>Jahre</small></div>
      <h1 id="welcome-title">Alles Gute<br />zum <em>18.</em></h1>
      <p className="hero-copy">Kein Ding, das im Regal verstaubt. Sondern Zeit zusammen, Sonne im Gesicht und ein Ort, den <strong>du</strong> aussuchst.</p>
      <div className="promise"><span>Wir zwei.</span><span>Meer.</span><span>Neue Orte.</span></div>
      <button className="primary-button" onClick={onStart}>
        {hasProgress ? 'Weiter entdecken' : 'Reiseziele entdecken'} <Icon name="arrow" />
      </button>
      <p className="budget-hint">Reise-Gutschein für zwei · insgesamt höchstens 2.000 € · noch nicht gebucht</p>
    </section>
  )
}

function Discovery({ state, onDecide, onUndo, canUndo }: {
  state: SelectionState
  onDecide: (id: string, decision: Direction) => void
  onUndo: () => void
  canUndo: boolean
}) {
  const current = destinations.find((destination) => state.decisions[destination.id] === 'unseen')
  const completed = progress(state)

  return (
    <section className="discover page-enter" aria-labelledby="discover-title">
      <div className="section-heading">
        <div><span className="eyebrow">Deine Reise, deine Wahl</span><h1 id="discover-title">Wohin zieht es dich?</h1></div>
        <span className="counter"><strong>{completed}</strong> / {destinations.length}</span>
      </div>
      <div className="progress-track" aria-label={`${completed} von ${destinations.length} Zielen bewertet`}>
        <span style={{ width: `${(completed / destinations.length) * 100}%` }} />
      </div>

      {current ? (
        <SwipeCard key={current.id} destination={current} onDecision={(decision) => onDecide(current.id, decision)} />
      ) : (
        <div className="deck-finished">
          <span className="finish-icon">✓</span>
          <h2>Alle Ziele entdeckt!</h2>
          <p>Deine Favoriten warten jetzt auf dich. Du kannst Entscheidungen jederzeit ändern.</p>
          <button className="primary-button" onClick={() => go('favorites')}>Favoriten ansehen <Icon name="arrow" /></button>
        </div>
      )}

      <button className="undo-button" onClick={onUndo} disabled={!canUndo} title={canUndo ? 'Letzte Entscheidung zurücknehmen' : 'Noch keine Entscheidung'}>
        <Icon name="undo" /> Rückgängig
      </button>
    </section>
  )
}

function SwipeCard({ destination, onDecision }: { destination: Destination; onDecision: (decision: Direction) => void }) {
  const cardRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const pointer = useRef<{ id: number; x: number; y: number; dx: number; dy: number; mode: 'pending' | 'horizontal' | 'vertical' } | null>(null)
  const [dragX, setDragX] = useState(0)
  const [leaving, setLeaving] = useState<Direction | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const locked = useRef(false)

  const showImage = (direction: -1 | 1) => {
    setImageIndex((current) => (current + direction + destination.images.length) % destination.images.length)
  }

  const commit = (decision: Direction) => {
    if (locked.current) return
    locked.current = true
    setLeaving(decision)
    window.setTimeout(() => onDecision(decision), 180)
  }

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (locked.current || event.pointerType === 'touch' && !event.isPrimary) return
    if (event.clientX < 20 || window.innerWidth - event.clientX < 20) return
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, dy: 0, mode: 'pending' }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const active = pointer.current
    if (!active || active.id !== event.pointerId) return
    const dx = event.clientX - active.x
    const dy = event.clientY - active.y
    active.dx = dx
    active.dy = dy
    if (active.mode === 'pending' && Math.hypot(dx, dy) >= 12) {
      if (Math.abs(dx) >= 1.25 * Math.abs(dy)) active.mode = 'horizontal'
      else if (Math.abs(dy) >= 1.25 * Math.abs(dx)) active.mode = 'vertical'
    }
    if (active.mode === 'horizontal') setDragX(dx)
  }

  const endPointer = (event: React.PointerEvent<HTMLElement>, cancelled = false) => {
    const active = pointer.current
    if (!active || active.id !== event.pointerId) return
    pointer.current = null
    const movement = Math.hypot(active.dx, active.dy)
    if (!cancelled && movement < 10 && mediaRef.current) {
      const bounds = mediaRef.current.getBoundingClientRect()
      const relativeX = event.clientX - bounds.left
      showImage(relativeX < bounds.width / 2 ? -1 : 1)
      setDragX(0)
      return
    }
    if (!cancelled && active.mode === 'horizontal') {
      const threshold = Math.max(80, (cardRef.current?.offsetWidth ?? 320) * 0.25)
      if (Math.abs(active.dx) >= threshold) {
        commit(active.dx > 0 ? 'liked' : 'passed')
        return
      }
    }
    setDragX(0)
  }

  const rotation = Math.max(-8, Math.min(8, dragX / 25))
  const transform = leaving
    ? `translateX(${leaving === 'liked' ? 120 : -120}vw) rotate(${leaving === 'liked' ? 8 : -8}deg)`
    : `translateX(${dragX}px) rotate(${rotation}deg)`

  return (
    <>
      <div className="card-stage">
        <div className="card-shadow card-shadow-two" aria-hidden="true" />
        <div className="card-shadow card-shadow-one" aria-hidden="true" />
        <article
          ref={cardRef}
          className={`travel-card ${leaving ? 'is-leaving' : ''}`}
          style={{ transform }}
          tabIndex={0}
          aria-label={`${destination.title}. Klick auf die linke oder rechte Kartenhälfte wechselt das Bild. Mit linker oder rechter Pfeiltaste bewerten.`}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return
            if (event.key === 'ArrowLeft') commit('passed')
            if (event.key === 'ArrowRight') commit('liked')
          }}
        >
          <div
            ref={mediaRef}
            className="card-media"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={(event) => endPointer(event)}
            onPointerCancel={(event) => endPointer(event, true)}
          >
            <img
              src={destination.images[imageIndex].src}
              alt={destination.images[imageIndex].alt}
              draggable="false"
              onError={(event) => {
                if (!event.currentTarget.src.endsWith('/reise/images/image-fallback.svg')) {
                  event.currentTarget.src = '/reise/images/image-fallback.svg'
                  event.currentTarget.alt = `Bild von ${destination.title} konnte nicht geladen werden.`
                }
              }}
            />
            <div className="gallery-progress" aria-hidden="true">
              {destination.images.map((image, index) => <span className={index === imageIndex ? 'active' : ''} key={image.src} />)}
            </div>
            <button className="gallery-zone gallery-previous" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); showImage(-1) }} aria-label={`Vorheriges Bild von ${destination.title}`}>‹</button>
            <button className="gallery-zone gallery-next" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); showImage(1) }} aria-label={`Nächstes Bild von ${destination.title}`}>›</button>
            <span className="image-counter">{imageIndex + 1} / {destination.images.length}</span>
            <div className={`swipe-label pass-label ${dragX < -25 ? 'visible' : ''}`}>← Eher nicht</div>
            <div className={`swipe-label like-label ${dragX > 25 ? 'visible' : ''}`}>Gefällt mir →</div>
            <div className="image-shade" />
            <div className="card-heading">
              <div className="location-line"><span>{destination.country}</span><span className="cost-pill">Kosten noch offen</span></div>
              <h2>{destination.title}</h2>
              <p>{destination.teaser}</p>
              <div className="tags">{destination.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </div>
          </div>
          <div className="card-content">
            <p className="destination-description">{destination.description}</p>
            <div className="travel-facts">
              <span><strong>Dauer</strong>{destination.duration}</span>
              <span><strong>Reisezeit</strong>{destination.travelTime}</span>
            </div>
            <p className="origin-note">{destination.originNote}</p>

            <section className="card-list-section" aria-labelledby={`${destination.id}-activities`}>
              <span className="list-kicker">Das könntet ihr erleben</span>
              <h3 id={`${destination.id}-activities`}>Aktivitäten</h3>
              <ul>{destination.activities.map((activity) => <li key={activity}>{activity}</li>)}</ul>
            </section>

            <section className="card-list-section accommodation-section" aria-labelledby={`${destination.id}-accommodation`}>
              <span className="list-kicker">Vorschläge zum Prüfen</span>
              <h3 id={`${destination.id}-accommodation`}>Unterkunft</h3>
              <ul>{destination.accommodations.map((item) => <li key={item.text}>{item.url ? <a href={item.url} target="_blank" rel="noreferrer">{item.text}</a> : item.text}</li>)}</ul>
            </section>

            <section className="card-list-section compact-list">
              <h3>Food-Spots</h3>
              <ul>{destination.foodSpots.map((item) => <li key={item.text}>{item.url ? <a href={item.url} target="_blank" rel="noreferrer">{item.text}</a> : item.text}</li>)}</ul>
            </section>

            <div className="inline-planning-note"><strong>Planungshinweis</strong><p>{destination.planningNote}</p><span>{destination.budgetNote}</span></div>
          </div>
        </article>
      </div>
      <div className="card-actions" aria-label="Ziel bewerten">
        <button className="decision-button pass" onClick={() => commit('passed')}><span>×</span>Eher nicht</button>
        <button className="detail-button" onClick={() => setDetailsOpen(true)}><Icon name="info" />Details</button>
        <button className="decision-button like" onClick={() => commit('liked')}><span>♥</span>Gefällt mir</button>
      </div>
      <p className="swipe-help">Im Bild wischen zum Bewerten · Tippen zum Bilderwechsel · nach unten für alle Infos</p>
      {detailsOpen && <DetailDialog destination={destination} onClose={() => setDetailsOpen(false)} />}
    </>
  )
}

function DetailDialog({ destination, onClose }: { destination: Destination; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <button ref={closeRef} className="dialog-close" onClick={onClose} aria-label="Details schließen"><Icon name="close" /></button>
        <img src={destination.images[0].src} alt="" onError={(event) => { event.currentTarget.src = '/reise/images/image-fallback.svg' }} />
        <div className="dialog-body">
          <span className="eyebrow">{destination.country}</span><h2 id="detail-title">{destination.title}</h2>
          <p>{destination.description}</p>
          <div className="idea-grid">
            <div><h3>Aktivitäten</h3><ul>{destination.activities.map((idea) => <li key={idea}>{idea}</li>)}</ul></div>
            <div><h3>Unterkunft</h3><ul>{destination.accommodations.map((item) => <li key={item.text}>{item.text}</li>)}</ul></div>
          </div>
          <div className="planning-box"><strong>Planungsstand</strong><p>{destination.planningNote}</p><span>{destination.duration} · {destination.travelTime} · Preise und Anreise noch zu prüfen</span></div>
        </div>
      </section>
    </div>
  )
}

function Favorites({ items, onDiscover, onRemove }: { items: Destination[]; onDiscover: () => void; onRemove: (id: string) => void }) {
  return (
    <section className="list-page page-enter" aria-labelledby="favorites-title">
      <span className="eyebrow">Deine Auswahl</span><h1 id="favorites-title">Favoriten <em>{items.length}</em></h1>
      <p className="page-intro">Hier sammeln sich alle Ziele, die dir gefallen. Vergleichen und Wunschbestätigung folgen in der nächsten Ausbaustufe.</p>
      {items.length === 0 ? <div className="empty-state"><span>♡</span><h2>Noch kein Ziel dabei?</h2><p>Entdecke die 50 Reiseideen und markiere, was sich gut anfühlt.</p><button className="primary-button" onClick={onDiscover}>Weiter entdecken</button></div> :
        <div className="favorite-list">{items.map((item) => <article className="favorite-card" key={item.id}><img src={item.images[0].src} alt="" onError={(event) => { event.currentTarget.src = '/reise/images/image-fallback.svg' }}/><div><span>{item.country}</span><h2>{item.title}</h2><p>{item.teaser}</p><button onClick={() => onRemove(item.id)}>Als „eher nicht“ markieren</button></div></article>)}</div>}
    </section>
  )
}

function Info({ onReset }: { onReset: () => void }) {
  return <section className="list-page info-page page-enter" aria-labelledby="info-title"><span className="eyebrow">Gut zu wissen</span><h1 id="info-title">Über dein Geschenk</h1><div className="info-block"><h2>So funktioniert es</h2><p>Entdecke 50 Reiseideen. Wische im Bild nach rechts für „Gefällt mir“ oder nach links für „Eher nicht“. Tippe links oder rechts ins Bild, um durch die sechs Motive zu wechseln. Aktivitäten und Unterkunft stehen direkt unter den Bildern.</p></div><div className="info-block"><h2>Der Reiserahmen</h2><p>Geplant ist eine Reise für uns zwei. Das Gesamtbudget beträgt höchstens 2.000 €. Dauer und Reisezeit sind redaktionelle Vorschläge; Termine, Anreise, Unterkunft und vollständige Kosten prüfen und planen wir später gemeinsam.</p></div><div className="info-block"><h2>Bilder und Quellen</h2><p>Die aktuelle lokale Vorschau lädt die in der Katalogdatei genannten externen Bildlinks in ihrer festgelegten Reihenfolge. Diese Verlinkungen sind keine geklärten Bildlizenzen. Vor einer öffentlichen Veröffentlichung müssen Nutzungsrechte geprüft und freigegebene Bilder lokal eingebunden werden.</p></div><div className="info-block"><h2>Speicherung & Datenschutz</h2><p>Deine Auswahl wird auf dem privaten Geschenk-Server gespeichert und zusätzlich in diesem Browser zwischengespeichert. So kann sie beim späteren Öffnen wieder geladen werden. Es erfolgt keine automatische Buchung oder Weitergabe an Reiseanbieter.</p></div><button className="danger-button" onClick={onReset}>Alle meine Auswahldaten löschen</button></section>
}

function NavButton({ active, icon, label, badge, onClick }: { active: boolean; icon: 'compass' | 'heart' | 'info'; label: string; badge?: number; onClick: () => void }) {
  return <button className={active ? 'active' : ''} onClick={onClick} aria-current={active ? 'page' : undefined}><span className="nav-icon"><Icon name={icon} />{badge !== undefined && badge > 0 && <small>{badge}</small>}</span><span>{label}</span></button>
}