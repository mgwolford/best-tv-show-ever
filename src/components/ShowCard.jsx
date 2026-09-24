import { posterUrl } from '../services/tmdb'

export default function ShowCard({
  show,
  selected,
  onSelect,
  onConfirm,
  inert = false,
}) {
  return <article className={`show-card${selected ? ' is-selected' : ''}`}>
    <button
      className="show-card__pick"
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      disabled={inert}
    >
      {show.poster_path
        ? <img src={posterUrl(show.poster_path)} alt="" />
        : <div className="poster-placeholder">No image</div>}
      <span className="show-card__body">
        <strong title={show.name}>{show.name}</strong>
        <span>{show.first_air_date?.slice(0, 4) || 'Year unknown'}</span>
      </span>
    </button>
    {selected && onConfirm && <button className="show-card__confirm" type="button" onClick={onConfirm}>
      Confirm pick
    </button>}
  </article>
}
