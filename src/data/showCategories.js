export const GENRES = [
  { id: 10759, name: 'Action & Adventure' }, { id: 16, name: 'Animation' }, { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' }, { id: 10751, name: 'Family' }, { id: 10762, name: 'Kids' },
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

function makePool(genres, decades) {
  return genres.flatMap((genre) => decades.map((decade) => ({
    genre,
    decade,
    key: `${genre.id}-${decade.label}`,
  })))
}

function seededNumber(text) {
  let value = 2166136261
  for (const character of text) {
    value ^= character.charCodeAt(0)
    value = Math.imul(value, 16777619)
  }
  return value >>> 0
}

export function categoryForMode(channelGroup, exclude = null) {
  let genres = GENRES
  let decades = DECADES

  if (channelGroup === 'broadcast') decades = DECADES.slice(1)
  if (channelGroup === 'premium') {
    genres = GENRES.filter((genre) => ![10762, 37].includes(genre.id))
    decades = DECADES.slice(3)
  }
  if (channelGroup === 'streaming') {
    genres = GENRES.filter((genre) => ![10762, 10764, 37].includes(genre.id))
    decades = DECADES.slice(6)
  }

  const pool = makePool(genres, decades).filter((item) => item.key !== exclude)
  return pool[Math.floor(Math.random() * pool.length)]
}

export function dailyCategories() {
  const today = new Date().toISOString().slice(0, 10)
  const genres = GENRES.filter((genre) => ![10762, 10764, 37].includes(genre.id))
  const decades = DECADES.slice(2)
  const seed = seededNumber(today)
  const lockGenre = seed % 2 === 0
  const fixedGenre = genres[seed % genres.length]
  const fixedDecade = decades[seed % decades.length]

  return Array.from({ length: 30 }, (_, index) => {
    const genre = lockGenre
      ? fixedGenre
      : genres[(seed + index) % genres.length]
    const decade = lockGenre
      ? decades[(seed + index) % decades.length]
      : fixedDecade

    return {
      genre,
      decade,
      key: `${genre.id}-${decade.label}`,
      challengeType: lockGenre ? 'genre' : 'decade',
    }
  })
}
