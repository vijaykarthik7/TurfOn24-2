export const GREEN = '#39F72A'
export const LIME = '#C7F42D'
export const DEEP = '#176B02'
export const CYAN = '#18AAC0'
export const CHROME = '#F3F3F3'
export const BLACK = '#000000'

const U = (id: string, w = 1200, h = 1500) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`

export const HERO_PLAYER = U('photo-1560272564-c83b66b1ad12', 1000, 1600)
export const GROUP_PLAYERS = U('photo-1579952363873-27f3bade9f55', 1100, 900)
export const READY_PLAYER = U('photo-1579952363873-27f3bade9f55', 1000, 1400)

export const TURF_IMGS = [
  U('photo-1431324155629-1a6deb1dec8d', 1200, 900),
  U('photo-1459865264687-595d652de67e', 900, 1100),
  U('photo-1579952363873-27f3bade9f55', 900, 1100),
  U('photo-1517927033932-b3d18e61fb3a', 900, 1100),
]

export const STATS = [
  { value: '50+', label: 'Premium Turfs', icon: '◍' },
  { value: '10K+', label: 'Bookings', icon: '◷' },
  { value: '25K+', label: 'Players', icon: '◉' },
  { value: '24/7', label: 'Availability', icon: '✳' },
]

export interface Turf {
  id: string
  name: string
  location: string
  rating: number
  price: number
  img: string
  featured?: boolean
}

export const TURFS: Turf[] = [
  { id: 't1', name: 'Arena Turf', location: 'Central Ground, Sector 12', rating: 4.9, price: 700, img: TURF_IMGS[0], featured: true },
  { id: 't2', name: 'Pitch 9', location: 'Sports Complex, MG Road', rating: 4.8, price: 650, img: TURF_IMGS[1] },
  { id: 't3', name: 'Greenview Arena', location: 'Stadium Road, Block B', rating: 4.7, price: 600, img: TURF_IMGS[2] },
  { id: 't4', name: 'Night Turf', location: 'City Park, Near Metro', rating: 4.9, price: 750, img: TURF_IMGS[3] },
]

export const PLATFORM_STEPS = [
  { n: '01', title: 'Find', text: 'Discover premium turfs near you.' },
  { n: '02', title: 'Book', text: 'Choose your date and preferred time slot.' },
  { n: '03', title: 'Play', text: 'Arrive and enjoy your game.' },
]

export const TURF_NAMES = ['Arena Turf', 'Pitch 9', 'Greenview Arena', 'Night Turf']

export const SLOT_START = 18
export const SLOT_COUNT = 6

export const seeded = (key: string) => {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const fmtDate = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`

export const fmtHour = (h: number) => {
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:00 ${h < 12 ? 'AM' : 'PM'}`
}
