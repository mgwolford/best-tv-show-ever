export const GENRES = [
  { id: 10759, name: 'Action & Adventure' }, { id: 16, name: 'Animation' }, { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' }, { id: 18, name: 'Drama' }, { id: 10751, name: 'Family' }, { id: 10762, name: 'Kids' },
  { id: 9648, name: 'Mystery' }, { id: 10764, name: 'Reality' }, { id: 10765, name: 'Sci-Fi & Fantasy' }, { id: 37, name: 'Western' },
]
export const DECADES = [
  { label: '1950s', start: '1950-01-01', end: '1959-12-31' }, { label: '1960s', start: '1960-01-01', end: '1969-12-31' },
  { label: '1970s', start: '1970-01-01', end: '1979-12-31' }, { label: '1980s', start: '1980-01-01', end: '1989-12-31' },
  { label: '1990s', start: '1990-01-01', end: '1999-12-31' }, { label: '2000s', start: '2000-01-01', end: '2009-12-31' },
  { label: '2010s', start: '2010-01-01', end: '2019-12-31' }, { label: '2020s', start: '2020-01-01', end: '2029-12-31' },
]
export const CHANNEL_GROUPS = {
  broadcast: { name: 'Broadcast', subtitle: 'ABC • CBS • NBC • FOX', networkIds: [2, 16, 6, 19] },
  premium: { name: 'Premium', subtitle: 'HBO • Showtime • Starz', networkIds: [49, 67, 318] },
  streaming: { name: 'Streaming', subtitle: 'Netflix • Hulu • Prime • Apple TV+ • Paramount+ • Peacock', networkIds: [213, 453, 1024, 2552, 4330, 3353] },
}
export function randomCategory(exclude = null) { const pool = []; for (const genre of GENRES) for (const decade of DECADES) { const key = `${genre.id}-${decade.label}`; if (key !== exclude) pool.push({ genre, decade, key }) }; return pool[Math.floor(Math.random() * pool.length)] }
export function dailyCategories() { const today = new Date().toISOString().slice(0, 10); let seed = [...today].reduce((sum, char) => sum + char.charCodeAt(0), 0); return Array.from({ length: 6 }, (_, index) => { seed = (seed * 9301 + 49297) % 233280; const genre = GENRES[(seed + index) % GENRES.length]; const decade = DECADES[(seed * 7 + index) % DECADES.length]; return { genre, decade, key: `${genre.id}-${decade.label}` } }) }
