import { useCallback, useEffect, useMemo, useState } from 'react'
import { CHANNEL_GROUPS, dailyCategories, randomCategory } from '../data/showCategories'
import { getShowChoices } from '../services/tmdb'
import ShowCard from './ShowCard'

export default function ShowSelection({ mode, channelGroup, onExit }) {
  const daily = useMemo(() => dailyCategories(), [])
  const initial = useMemo(() => mode === 'daily' ? daily[0] : randomCategory(), [daily, mode])
  const [category, setCategory] = useState(initial); const [shows, setShows] = useState([]); const [lineup, setLineup] = useState([])
  const [selectedId, setSelectedId] = useState(null); const [rerolls, setRerolls] = useState(mode === 'daily' ? 0 : 2)
  const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  const group = channelGroup ? CHANNEL_GROUPS[channelGroup] : null

  const loadShows = useCallback(async (nextCategory) => {
    setLoading(true); setError(''); setSelectedId(null)
    try { const choices = await getShowChoices({ genre: nextCategory.genre, decade: nextCategory.decade, networkIds: group?.networkIds || [] }); if (choices.length < 8) throw new Error(`Only ${choices.length} matching shows were found. Try a reroll.`); setShows(choices) }
    catch (caught) { setShows([]); setError(caught.message) } finally { setLoading(false) }
  }, [group])

  useEffect(() => { loadShows(initial) }, [initial, loadShows])
  const reroll = () => { if (!rerolls) return; const next = randomCategory(category.key); setCategory(next); setRerolls((count) => count - 1); loadShows(next) }
  const confirmPick = () => {
    const picked = shows.find((show) => show.id === selectedId); if (!picked) return
    const nextLineup = [...lineup, picked]; setLineup(nextLineup); setSelectedId(null)
    if (nextLineup.length < 6) { const next = mode === 'daily' ? daily[nextLineup.length] : randomCategory(category.key); setCategory(next); loadShows(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  }

  if (lineup.length === 6) return <main className="game-shell results-screen"><p className="game-kicker">The final lineup</p><h1>That's Must-See TV</h1><div className="lineup-grid">{lineup.map((show) => <ShowCard key={show.id} show={show} inert />)}</div><button className="primary-button" type="button" onClick={onExit}>Build another lineup</button></main>

  return <main className="game-shell">
    <header className="selection-header"><button className="text-button" type="button" onClick={onExit}>← Exit game</button><div className="round-copy"><p className="game-kicker">{group?.name || (mode === 'daily' ? 'Daily Challenge' : 'Classic')} · Pick {lineup.length + 1} of 6</p><h1>{category.genre.name}</h1><p className="decade-label">{category.decade.label}</p></div><div className="reroll-box"><span>{rerolls} rerolls left</span><button type="button" onClick={reroll} disabled={!rerolls || loading}>Reroll genre + decade</button></div></header>
    {loading && <div className="status-panel">Tuning in today's choices…</div>}
    {error && <div className="status-panel status-panel--error"><strong>We lost the signal.</strong><span>{error}</span>{rerolls > 0 && <button type="button" onClick={reroll}>Try a reroll</button>}</div>}
    {!loading && !error && <><section className="show-grid" aria-label="Show choices">{shows.map((show) => <ShowCard key={show.id} show={show} selected={show.id === selectedId} onSelect={() => setSelectedId(show.id)} />)}</section>{selectedId && <div className="confirm-bar"><p>Lock <strong>{shows.find((show) => show.id === selectedId)?.name}</strong> into your lineup?</p><button className="primary-button" type="button" onClick={confirmPick}>Confirm pick</button></div>}</>}
    {lineup.length > 0 && <aside className="lineup-strip"><strong>Your lineup</strong>{lineup.map((show, index) => <span key={show.id}>{index + 1}. {show.name}</span>)}</aside>}
    <footer className="tmdb-credit">This product uses the TMDB API but is not endorsed or certified by TMDB.</footer>
  </main>
}
