import { useMemo, useState } from 'react'
import { posterUrl } from '../services/tmdb'

function lineupScore(lineup) {
  if (!lineup.length) return 0
  const total = lineup.reduce((sum, show) => {
    const ratingPoints = Math.min(Number(show.vote_average) || 0, 10) * 9
    const popularityPoints = Math.min(Number(show.popularity) || 0, 100) / 10
    return sum + ratingPoints + popularityPoints
  }, 0)
  return Math.round(total / lineup.length)
}

function awardFor(score) {
  if (score >= 90) return { label: 'Prestige Television', detail: 'An all-time lineup. No notes.' }
  if (score >= 80) return { label: 'Must-See TV', detail: 'Cancel your plans. This lineup owns the night.' }
  if (score >= 70) return { label: 'Prime-Time Hit', detail: 'A strong schedule with serious crowd appeal.' }
  if (score >= 60) return { label: 'Fan Favorite', detail: 'Comfort viewing with plenty worth celebrating.' }
  return { label: 'Cult Classic', detail: 'A bold lineup made for the right audience.' }
}

export default function ResultsScreen({ lineup, onRestart }) {
  const [copyLabel, setCopyLabel] = useState('Copy results')
  const score = useMemo(() => lineupScore(lineup), [lineup])
  const award = awardFor(score)
  const shareText = `My Best TV Show Ever lineup scored ${score}/100: ${lineup.map((show) => show.name).join(', ')}.`

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'My Best TV Show Ever Lineup', text: shareText, url: window.location.origin }) }
      catch (error) { if (error.name !== 'AbortError') console.error(error) }
      return
    }
    await copy()
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${window.location.origin}`)
      setCopyLabel('Copied!')
      window.setTimeout(() => setCopyLabel('Copy results'), 1800)
    } catch { setCopyLabel('Could not copy') }
  }

  return <main className="game-shell results-screen">
    <header className="results-hero">
      <div className="results-score" aria-label={`Lineup score: ${score} out of 100`}>
        <strong>{score}</strong><span>/100</span>
      </div>
      <div className="results-title">
        <p className="game-kicker">Your final lineup</p>
        <h1>{award.label}</h1>
        <p>{award.detail}</p>
      </div>
    </header>

    <section className="results-lineup" aria-labelledby="lineup-heading">
      <h2 id="lineup-heading">Tonight's Schedule</h2>
      <div className="results-grid">
        {lineup.map((show, index) => <article className="result-card" key={show.id}>
          <div className="result-card__number">{String(index + 1).padStart(2, '0')}</div>
          {show.poster_path ? <img src={posterUrl(show.poster_path)} alt="" /> : <div className="poster-placeholder">No poster</div>}
          <div className="result-card__body">
            <strong title={show.name}>{show.name}</strong>
            <span>{show.first_air_date?.slice(0, 4) || 'Year unknown'}</span>
          </div>
        </article>)}
      </div>
    </section>

    <section className="results-actions" aria-label="Share or play again">
      <button className="primary-button" type="button" onClick={share}>Share lineup</button>
      <button className="secondary-button" type="button" onClick={copy}>{copyLabel}</button>
      <button className="text-button restart-button" type="button" onClick={onRestart}>↻ Build another lineup</button>
    </section>

    <section className="more-games" aria-labelledby="more-games-heading">
      <p className="game-kicker">Keep playing</p>
      <h2 id="more-games-heading">Try My Other Games</h2>
      <div className="more-games__links">
        <a href="https://best-film-festival.com" target="_blank" rel="noreferrer"><span>Best Film Festival</span><small>Build the ultimate six-film festival →</small></a>
        <a href="https://mgwolford.github.io/best-video-game-collection/" target="_blank" rel="noreferrer"><span>Best Video Game Collection</span><small>Create your all-time game collection →</small></a>
      </div>
    </section>

    <footer className="tmdb-credit">This product uses the TMDB API but is not endorsed or certified by TMDB.</footer>
  </main>
}
