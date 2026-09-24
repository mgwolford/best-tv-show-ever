const API_ROOT = 'https://api.themoviedb.org/3'; const IMAGE_ROOT = 'https://image.tmdb.org/t/p/w500'
function authHeaders() { const token = import.meta.env.VITE_TMDB_READ_TOKEN; return token ? { Authorization: `Bearer ${token}` } : {} }
export function posterUrl(path) { return path ? `${IMAGE_ROOT}${path}` : null }
async function request(path, params = {}) { const apiKey = import.meta.env.VITE_TMDB_API_KEY; const query = new URLSearchParams({ language: 'en-US', ...params }); if (apiKey) query.set('api_key', apiKey); if (!apiKey && !import.meta.env.VITE_TMDB_READ_TOKEN) throw new Error('Add VITE_TMDB_API_KEY or VITE_TMDB_READ_TOKEN to your .env file.'); const response = await fetch(`${API_ROOT}${path}?${query}`, { headers: authHeaders() }); if (!response.ok) throw new Error(`TMDB request failed (${response.status}).`); return response.json() }
function shuffle(items) { const copy = [...items]; for (let i = copy.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]] } return copy }
export async function getShowChoices({ genre, decade, networkIds = [], channelGroup = null }) {
  const isStreaming = channelGroup === 'streaming'
  const base = {
    sort_by: 'popularity.desc',
    with_genres: genre.id,
    'first_air_date.gte': decade.start,
    'first_air_date.lte': decade.end,
    include_null_first_air_dates: 'false',
    'vote_count.gte': isStreaming ? '20' : networkIds.length ? '2' : '10',
  }
  if (isStreaming) base.with_original_language = 'en'
  if (networkIds.length) base.with_networks = networkIds.join('|')

  const first = await request('/discover/tv', { ...base, page: '1' })
  const pageCount = Math.min(first.total_pages || 1, 4)
  const otherPages = shuffle(Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) => index + 2)).slice(0, 3)
  const responses = await Promise.all([
    Promise.resolve(first),
    ...otherPages.map((page) => request('/discover/tv', { ...base, page: String(page) })),
  ])
  const unique = [...new Map(
    responses
      .flatMap((item) => item.results)
      .filter((show) => show.poster_path && show.name)
      .map((show) => [show.id, show]),
  ).values()]
  return shuffle(unique).slice(0, 8)
}
