import { useCallback, useEffect, useMemo, useState } from 'react'
import { CHANNEL_GROUPS, categoryForMode, dailyCategories } from '../data/showCategories'
import { getShowChoices } from '../services/tmdb'
import ShowCard from './ShowCard'
import ResultsScreen from './ResultsScreen'

export default function ShowSelection({ mode, channelGroup, onExit }) {
  const daily = useMemo(() => dailyCategories(), [])
  const initial = useMemo(() => mode === 'daily' ? daily[0] : categoryForMode(channelGroup), [channelGroup, daily, mode])
  const [category, setCategory] = useState(initial); const [shows, setShows] = useState([]); const [lineup, setLineup] = useState([])
  const [selectedId, setSelectedId] = useState(null); const [rerolls, setRerolls] = useState(mode === 'daily' ? 0 : 2)
  const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  const group = channelGroup ? CHANNEL_GROUPS[channelGroup] : null

  const loadShows = useCallback(async (nextCategory, roundIndex = 0) => {
    setLoading(true); setError(''); setSelectedId(null)
    try {
      let candidate = nextCategory
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const choices = await getShowChoices({
          genre: candidate.genre,
          decade: candidate.decade,
          networkIds: group?.networkIds || [],
          channelGroup,
        })
        if (choices.length >= 8) {
          setCategory(candidate)
          setShows(choices)
          return
        }
        candidate = mode === 'daily'
          ? daily[6 + (roundIndex * 4) + attempt]
          : categoryForMode(channelGroup, candidate.key)
      }
      throw new Error('TMDB could not find eight shows for this mode. Please try again.')
    }
    catch (caught) { setShows([]); setError(caught.message) } finally { setLoading(false) }
  }, [channelGroup, daily, group, mode])

  useEffect(() => { loadShows(initial) }, [initial, loadShows])
  const reroll = () => { if (!rerolls) return; const next = categoryForMode(channelGroup, category.key); setCategory(next); setRerolls((count) => count - 1); loadShows(next, lineup.length) }
  const confirmPick = () => {
    const picked = shows.find((show) => show.id === selectedId); if (!picked) return
    const nextLineup = [...lineup, picked]; setLineup(nextLineup); setSelectedId(null)
    if (nextLineup.length < 6) {
      const next = mode === 'daily'
        ? daily[nextLineup.length]
        : categoryForMode(channelGroup, category.key)
      setCategory(next)
      loadShows(next, nextLineup.length)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (lineup.length === 6) return <ResultsScreen lineup={lineup} onRestart={onExit} />

  return <main className="game-shell">
    <header className="selection-header">
      <button className="text-button selection-exit" type="button" onClick={onExit}>← Exit game</button>
      <div className="round-copy">
        <p className="game-kicker">{group?.name || (mode === 'daily' ? 'Daily Challenge' : 'Classic')} · Pick {lineup.length + 1} of 6</p>
        <h1>{category.genre.name}</h1>
        <p className="decade-label">{category.decade.label}</p>
      </div>
      <div className="reroll-box">
        <span>{rerolls} rerolls left</span>
        <button type="button" onClick={reroll} disabled={!rerolls || loading}>
          <svg className="reroll-icon" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M10 7 6 3M22 7l4-4M6 9h20a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3Z" />
            <path d="M12 15a6 6 0 0 1 9-1l2 2M23 12v4h-4M20 23a6 6 0 0 1-9 1l-2-2M9 26v-4h4" />
          </svg>
          <span>Reroll genre + decade</span>
        </button>
      </div>
    </header>
    {loading && <div className="status-panel">Tuning in today's choices…</div>}
    {error && <div className="status-panel status-panel--error"><strong>We lost the signal.</strong><span>{error}</span>{rerolls > 0 && <button type="button" onClick={reroll}>Try a reroll</button>}</div>}
    {!loading && !error && <section className="show-grid" aria-label="Show choices">{shows.map((show) => <ShowCard key={show.id} show={show} selected={show.id === selectedId} onSelect={() => setSelectedId(show.id)} onConfirm={show.id === selectedId ? confirmPick : undefined} />)}</section>}
    {lineup.length > 0 && <aside className="lineup-strip"><strong>Your lineup</strong>{lineup.map((show, index) => <span key={show.id}>{index + 1}. {show.name}</span>)}</aside>}
    <footer className="tmdb-credit">This product uses the TMDB API but is not endorsed or certified by TMDB.</footer>
  </main>
}
