import { useRef, useState, type ChangeEvent } from 'react'
import { getExtendedEnquiries } from '../../services/enquiryStore'
import { getContactLeads, updateContactLeadStatus } from '../../services/contactLeadStore'
import type { ContactLead } from '../../services/contactLeadStore'
import logoTagline from '../../assets/Tagline.png'

const ACCENT = '#39FF7A'
const ACCENT_RGB = '57,255,122'

type HourlyBooking = {
  id: string
  customer: string
  phone: string
  date: string
  start: string
  end: string
  duration: number
  amount: number
  status: 'Confirmed' | 'Completed' | 'Cancelled'
}

type ExtendedBooking = {
  id: string
  customer: string
  phone: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  requirements: string
  options: string[]
  phoneVerified: boolean
  players: number
  submittedAt: string
  status: 'Pending' | 'Confirmed' | 'New' | 'NEW'
}

type Customer = {
  name: string
  phone: string
  bookings: number
  total: number
  lastBooking: string
}

const HOURLY: HourlyBooking[] = [
  { id: 'TF24-1021', customer: 'Arjun Mehta', phone: '+91 98123 45601', date: '14 Aug 2026', start: '6:00 PM', end: '7:00 PM', duration: 1, amount: 700, status: 'Confirmed' },
  { id: 'TF24-1020', customer: 'Rohit Sharma', phone: '+91 98200 11223', date: '14 Aug 2026', start: '8:00 PM', end: '10:00 PM', duration: 2, amount: 1400, status: 'Confirmed' },
  { id: 'TF24-1019', customer: 'Sneha Kapoor', phone: '+91 98333 22110', date: '13 Aug 2026', start: '7:00 AM', end: '8:00 AM', duration: 1, amount: 700, status: 'Completed' },
  { id: 'TF24-1018', customer: 'Vikram Singh', phone: '+91 98444 55667', date: '13 Aug 2026', start: '5:00 PM', end: '9:00 PM', duration: 4, amount: 2800, status: 'Completed' },
  { id: 'TF24-1017', customer: 'Priya Nair', phone: '+91 98555 88990', date: '12 Aug 2026', start: '9:00 AM', end: '11:00 AM', duration: 2, amount: 1400, status: 'Completed' },
  { id: 'TF24-1016', customer: 'Karan Malhotra', phone: '+91 98666 11220', date: '12 Aug 2026', start: '7:00 PM', end: '10:00 PM', duration: 3, amount: 2100, status: 'Cancelled' },
  { id: 'TF24-1015', customer: 'Aisha Khan', phone: '+91 98777 33445', date: '11 Aug 2026', start: '6:00 PM', end: '8:00 PM', duration: 2, amount: 1400, status: 'Completed' },
  { id: 'TF24-1014', customer: 'Dev Patel', phone: '+91 98888 77665', date: '11 Aug 2026', start: '4:00 PM', end: '7:00 PM', duration: 3, amount: 2100, status: 'Completed' },
]

const EXTENDED: ExtendedBooking[] = [
  { id: 'AR-2401', customer: 'Royal Sports Club', phone: '+91 90001 22334', startDate: '20 Aug 2026', startTime: '6:00 AM', endDate: '20 Aug 2026', endTime: '4:00 PM', requirements: 'U-14 tournament, 4 teams, need goalposts and scoreboard setup.', options: ['Tournament Setup', 'Equipment Assistance'], phoneVerified: true, players: 40, submittedAt: '18 Aug 2026, 2:10 pm', status: 'Confirmed' },
  { id: 'AR-2402', customer: 'City Football Academy', phone: '+91 90002 44556', startDate: '22 Aug 2026', startTime: '5:00 PM', endDate: '23 Aug 2026', endTime: '9:00 AM', requirements: 'Overnight training camp for junior squad.', options: ['Floodlights Required', 'Equipment Assistance'], phoneVerified: true, players: 24, submittedAt: '19 Aug 2026, 9:40 am', status: 'Confirmed' },
  { id: 'AR-2403', customer: 'Corporate HR · Apex Tech', phone: '+91 90003 66778', startDate: '25 Aug 2026', startTime: '2:00 PM', endDate: '25 Aug 2026', endTime: '8:00 PM', requirements: 'Company sports day, expecting ~40 players across 6 matches.', options: ['Tournament Setup'], phoneVerified: true, players: 40, submittedAt: '20 Aug 2026, 11:22 am', status: 'Pending' },
  { id: 'AR-2404', customer: 'Fitness First Group', phone: '+91 90004 88990', startDate: '28 Aug 2026', startTime: '7:00 AM', endDate: '28 Aug 2026', endTime: '12:00 PM', requirements: 'Morning fitness bootcamp session with multiple groups.', options: ['Floodlights Required'], phoneVerified: false, players: 30, submittedAt: '21 Aug 2026, 6:05 pm', status: 'Pending' },
]

const fmtStoredDate = (iso: string) => {
  if (!iso) return '—'
  if (iso.includes('-')) {
    const [y, m, d] = iso.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  return iso
}

const fmtStoredTime = (t: string) => {
  if (!t) return '—'
  const [h, m] = t.split(':').map(Number)
  const am = h < 12
  const hh = h % 12 === 0 ? 12 : h % 12
  return `${hh}:${String(m).padStart(2, '0')} ${am ? 'AM' : 'PM'}`
}

const STORED_EXTENDED: ExtendedBooking[] = getExtendedEnquiries().map(e => ({
  id: e.id,
  customer: e.customer,
  phone: e.phone,
  startDate: fmtStoredDate(e.startDate),
  startTime: fmtStoredTime(e.startTime),
  endDate: fmtStoredDate(e.endDate),
  endTime: fmtStoredTime(e.endTime),
  requirements: e.message || '—',
  options: ['Website Enquiry'],
  phoneVerified: e.phoneVerified,
  players: e.players,
  submittedAt: e.submittedAt,
  status: e.status,
}))

const ALL_EXTENDED = [...EXTENDED, ...STORED_EXTENDED]

const DEMO_CONTACT_LEADS: ContactLead[] = [
  { id: 'CL-1001', name: 'Priya Nair', phone: '+91 98555 88990', email: 'priya.nair@outlook.com', message: 'Hi, I wanted to inquire about booking the turf for a weekend corporate team-building event. We have around 30 people. Could you share the rates for a full-day slot?', submittedAt: '18 Aug 2026, 10:30 am', status: 'New' },
  { id: 'CL-1002', name: 'Rohit Sharma', phone: '+91 98200 11223', email: 'rohit.s@gmail.com', message: 'Do you offer any membership plans for regular players? We come in every Thursday evening and the per-session cost is adding up. Would love a monthly pass option.', submittedAt: '17 Aug 2026, 3:15 pm', status: 'New' },
  { id: 'CL-1003', name: 'Ananya Desai', phone: '+91 98765 43210', email: 'ananya.d@rediffmail.com', message: 'I am organizing a birthday celebration for my son who turns 10 next Saturday. Can I book the turf from 4 PM to 7 PM? Also, do you provide any decoration or catering support?', submittedAt: '16 Aug 2026, 6:45 pm', status: 'Contacted' },
  { id: 'CL-1004', name: 'Vikram Singh', phone: '+91 98444 55667', email: 'vikram.s@company.in', message: 'Looking for floodlit turf availability on weekday evenings. We are a group of 22 football enthusiasts who play twice a week. Any group discount available?', submittedAt: '15 Aug 2026, 8:20 am', status: 'Contacted' },
  { id: 'CL-1005', name: 'Meera Joshi', phone: '+91 98111 22334', email: 'meera.joshi@yahoo.com', message: 'Can you confirm if the turf is safe for children under 12? We want to enroll our daughter in the junior football training camp you mentioned on Instagram.', submittedAt: '14 Aug 2026, 11:10 am', status: 'Closed' },
  { id: 'CL-1006', name: 'Karan Malhotra', phone: '+91 98666 11220', email: 'karan.m@techcorp.com', message: 'We need to cancel our booking for 20 August due to unforeseen circumstances. Please process the refund as per your cancellation policy. Booking ID TF24-1016.', submittedAt: '13 Aug 2026, 4:50 pm', status: 'Closed' },
  { id: 'CL-1007', name: 'Sneha Kapoor', phone: '+91 98333 22110', email: 'sneha.k@designstudio.co', message: 'Is there parking space available near the turf? We will have around 15 cars. Also, is there a changing room facility for players?', submittedAt: '12 Aug 2026, 9:00 am', status: 'New' },
  { id: 'CL-1008', name: 'Arjun Mehta', phone: '+91 98123 45601', email: 'arjun.m@startup.io', message: 'Great experience last time! I want to book again for next Friday. Same slot — 6 PM to 8 PM. Can you also arrange a referee for a friendly match?', submittedAt: '11 Aug 2026, 2:30 pm', status: 'Contacted' },
]

const CUSTOMERS: Customer[] = [
  { name: 'Arjun Mehta', phone: '+91 98123 45601', bookings: 4, total: 3500, lastBooking: '14 Aug 2026' },
  { name: 'Rohit Sharma', phone: '+91 98200 11223', bookings: 6, total: 7700, lastBooking: '14 Aug 2026' },
  { name: 'Sneha Kapoor', phone: '+91 98333 22110', bookings: 2, total: 1400, lastBooking: '13 Aug 2026' },
  { name: 'Vikram Singh', phone: '+91 98444 55667', bookings: 5, total: 9800, lastBooking: '13 Aug 2026' },
  { name: 'Priya Nair', phone: '+91 98555 88990', bookings: 3, total: 3500, lastBooking: '12 Aug 2026' },
  { name: 'Karan Malhotra', phone: '+91 98666 11220', bookings: 1, total: 2100, lastBooking: '12 Aug 2026' },
  { name: 'Aisha Khan', phone: '+91 98777 33445', bookings: 2, total: 2800, lastBooking: '11 Aug 2026' },
  { name: 'Dev Patel', phone: '+91 98888 77665', bookings: 3, total: 6300, lastBooking: '11 Aug 2026' },
  { name: 'Royal Sports Club', phone: '+91 90001 22334', bookings: 2, total: 18000, lastBooking: '20 Aug 2026' },
  { name: 'City Football Academy', phone: '+91 90002 44556', bookings: 1, total: 24000, lastBooking: '22 Aug 2026' },
]

type Section = 'overview' | 'hourly' | 'extended' | 'contact-leads' | 'customers' | 'settings'

const STATUS_COLORS: Record<string, string> = {
  Confirmed: '#39FF7A',
  Completed: '#5EA9FF',
  Cancelled: '#FF6B6B',
  Pending: '#F5B84C',
  New: '#39FF7A',
  Contacted: '#5EA9FF',
  Closed: '#A0A8B8',
}

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'hourly',
    label: 'Hourly Bookings',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    id: 'extended',
    label: 'Extended Bookings',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M8 2v4M16 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    id: 'contact-leads',
    label: 'Contact Leads',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" />
        <circle cx="17.5" cy="9" r="2.5" />
        <path d="M16 15.4c2.5-.2 4.4 1.4 5.5 3.6" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
      </svg>
    ),
  },
]

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]!.toUpperCase())
    .join('')

const parseBookingDate = (dateStr: string): string => {
  const months: Record<string, string> = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }
  const parts = dateStr.split(' ')
  if (parts.length !== 3) return dateStr
  const day = parts[0]!.padStart(2, '0')
  const month = months[parts[1]!] || '01'
  const year = parts[2]
  return `${year}-${month}-${day}`
}

const formatFilterDate = (isoDate: string): string => {
  if (!isoDate) return ''
  const [y, m, d] = isoDate.split('-').map(Number)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${d} ${months[(m || 1) - 1]} ${y}`
}

const exportCSV = (headers: string[], rows: (string | number)[][], filename: string) => {
  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
  ].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

const today = new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

const btnStyle = (active: boolean): React.CSSProperties => ({
  padding: '9px 18px', borderRadius: 10, border: '1px solid',
  borderColor: active ? 'rgba(57,255,122,0.5)' : 'rgba(160,168,184,0.2)',
  background: active ? 'rgba(57,255,122,0.12)' : 'rgba(11,24,36,0.5)',
  color: active ? ACCENT : 'rgba(245,245,245,0.6)',
  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
  textTransform: 'uppercase' as const, cursor: 'pointer', transition: 'all 0.2s ease',
  display: 'flex', alignItems: 'center', gap: 8,
})

function GallerySettingsCard() {
  const [images, setImages] = useState([
    { id: 1, name: 'hero-bg.png', url: '/hero-bg.png' },
    { id: 2, name: 'stadium-bg.png', url: '/stadium-bg.png' },
    { id: 3, name: 'bg2.png', url: '/bg2.png' },
  ])
  const [featuredId, setFeaturedId] = useState<number | null>(1)
  const [heroUrl, setHeroUrl] = useState('/hero-bg.png')
  const [heroDraft, setHeroDraft] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !files.length) return
    const added = Array.from(files).map((f, i) => ({ id: Date.now() + i, name: f.name, url: URL.createObjectURL(f) }))
    setImages(prev => [...prev, ...added])
    if (fileRef.current) fileRef.current.value = ''
  }

  const removeImage = (id: number) => {
    setImages(prev => prev.filter(img => img.id !== id))
    setFeaturedId(prev => (prev === id ? null : prev))
  }

  return (
    <div className="admin-card admin-row-in" style={{ padding: '28px 26px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#F2F4F2', marginBottom: 6 }}>Gallery Settings</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(245,245,245,0.5)' }}>Upload, delete and feature gallery images · change hero image</div>
        </div>
      </div>

      {/* Upload images */}
      <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleUpload} />
      <button onClick={() => fileRef.current?.click()} style={{ width: '100%', padding: '14px 16px', marginBottom: 16, background: `rgba(${ACCENT_RGB},0.06)`, border: `1px dashed rgba(${ACCENT_RGB},0.35)`, borderRadius: 10, color: ACCENT, fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.25s ease' }} onMouseEnter={e => { e.currentTarget.style.background = `rgba(${ACCENT_RGB},0.12)` }} onMouseLeave={e => { e.currentTarget.style.background = `rgba(${ACCENT_RGB},0.06)` }}>＋ Upload Images</button>

      {/* Image list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, maxHeight: 220, overflowY: 'auto' }}>
        {images.map(img => (
          <div key={img.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px', background: 'rgba(11,24,36,0.6)', border: featuredId === img.id ? `1px solid rgba(${ACCENT_RGB},0.4)` : '1px solid rgba(160,168,184,0.12)', borderRadius: 10 }}>
            <img src={img.url} alt={img.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
            <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'rgba(245,245,245,0.75)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{img.name}</span>
            <button title="Set as featured image" onClick={() => setFeaturedId(prev => (prev === img.id ? null : img.id))} style={{ padding: '6px 10px', background: featuredId === img.id ? `rgba(${ACCENT_RGB},0.15)` : 'transparent', border: `1px solid ${featuredId === img.id ? `rgba(${ACCENT_RGB},0.45)` : 'rgba(160,168,184,0.2)'}`, borderRadius: 8, color: featuredId === img.id ? ACCENT : 'rgba(245,245,245,0.5)', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0 }}>{featuredId === img.id ? '★ Featured' : '☆ Feature'}</button>
            <button title="Delete image" onClick={() => removeImage(img.id)} style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 8, color: '#FF6B6B', fontSize: 13, lineHeight: 1, cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0 }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.18)' }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.08)' }}>×</button>
          </div>
        ))}
        {!images.length && (
          <div style={{ padding: '16px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'rgba(245,245,245,0.45)' }}>No images yet — upload some above.</div>
        )}
      </div>

      {/* Change hero image */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.55)', marginBottom: 8 }}>Change Hero Image</div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
        <img src={heroUrl} alt="Current hero" style={{ width: 96, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(160,168,184,0.15)', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
          <input value={heroDraft} onChange={e => setHeroDraft(e.target.value)} placeholder="/hero-bg.png or https://…" style={{ width: '100%', padding: '9px 12px', background: 'rgba(11,24,36,0.8)', border: '1px solid rgba(160,168,184,0.2)', borderRadius: 8, color: '#F2F4F2', fontFamily: 'var(--font-body)', fontSize: 12.5, boxSizing: 'border-box' }} />
          <button disabled={!heroDraft.trim()} onClick={() => { setHeroUrl(heroDraft.trim()); setHeroDraft('') }} style={{ alignSelf: 'flex-start', padding: '8px 16px', background: heroDraft.trim() ? 'linear-gradient(135deg, #0FA857, #39FF7A)' : 'rgba(160,168,184,0.08)', border: 'none', borderRadius: 8, color: heroDraft.trim() ? '#030607' : 'rgba(245,245,245,0.4)', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: heroDraft.trim() ? 'pointer' : 'default', transition: 'all 0.2s ease' }}>Apply Hero Image</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [section, setSection] = useState<Section>('overview')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [hourlyView, setHourlyView] = useState<'current' | 'history'>('current')
  const [hourlyFilterDate, setHourlyFilterDate] = useState('')
  const [hourlyFilterOpen, setHourlyFilterOpen] = useState(false)
  const [extendedView, setExtendedView] = useState<'current' | 'history'>('current')
  const [extendedFilterOpen, setExtendedFilterOpen] = useState(false)
  const [extendedFilterDateFrom, setExtendedFilterDateFrom] = useState('')
  const [extendedFilterDateTo, setExtendedFilterDateTo] = useState('')
  const [extendedFilterStatus, setExtendedFilterStatus] = useState('')
  const [extendedFilterName, setExtendedFilterName] = useState('')
  const [extendedFilterPhone, setExtendedFilterPhone] = useState('')
  const [contactLeads, setContactLeads] = useState<ContactLead[]>(() => {
    const stored = getContactLeads()
    const storedIds = new Set(stored.map(l => l.id))
    const demoLeads = DEMO_CONTACT_LEADS.filter(l => !storedIds.has(l.id))
    return [...demoLeads, ...stored]
  })
  const [contactFilter, setContactFilter] = useState('')
  const [messageModal, setMessageModal] = useState<{ customer: string; message: string } | null>(null)
  const [customerView, setCustomerView] = useState<'hourly' | 'extended'>('hourly')

  const revenue = HOURLY.filter(b => b.status !== 'Cancelled').reduce((s, b) => s + b.amount, 0)
  const extendedRevenue = ALL_EXTENDED.filter(b => b.status === 'Confirmed').length * 12000
  const totalRevenue = revenue + extendedRevenue

  const currentHourlyCount = HOURLY.filter(b => b.status === 'Confirmed').length
  const currentExtendedCount = ALL_EXTENDED.filter(b => b.status === 'Pending' || b.status === 'New' || b.status === 'NEW').length

  const stats = [
    { label: 'Current Hourly Bookings', value: String(currentHourlyCount), trend: String(HOURLY.length), trendLabel: 'total', up: true },
    { label: 'Current Extended Bookings', value: String(currentExtendedCount), trend: String(ALL_EXTENDED.length), trendLabel: 'total', up: true },
    { label: 'Pending Enquiries', value: String(ALL_EXTENDED.filter(b => b.status === 'Pending' || b.status === 'New' || b.status === 'NEW').length), trend: String(ALL_EXTENDED.length), trendLabel: 'total', up: true },
    { label: 'Total Contact Leads', value: String(contactLeads.length), trend: String(contactLeads.filter(l => l.status === 'New').length), trendLabel: 'new', up: true },
  ]

  const Avatar = ({ name, size = 36 }: { name: string; size?: number }) => (
    <div
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg, rgba(${ACCENT_RGB},0.22), rgba(${ACCENT_RGB},0.08))`,
        border: '1px solid rgba(57,255,122,0.4)',
        color: ACCENT, fontFamily: 'var(--font-mono)', fontSize: size / 2.6, fontWeight: 600, letterSpacing: '0.02em',
      }}
    >
      {initials(name)}
    </div>
  )

  const StatusChip = ({ status }: { status: string }) => {
    const color = STATUS_COLORS[status] || '#A0A8B8'
    return (
      <span
        className="admin-chip"
        style={{
          color,
          background: `rgba(${ACCENT_RGB},0.06)`,
          borderColor: `${color}3D`,
          borderRadius: 50,
          padding: '5px 14px',
          animation: 'status-spin 8s linear infinite'
        }}
      >
        <span className="admin-live-dot" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
        {status}
      </span>
    )
  }

  const SectionHeader = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: ACCENT, marginBottom: 8 }}>
        {eyebrow}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(34px, 4vw, 52px)', textTransform: 'uppercase', lineHeight: 0.95, color: '#F2F4F2' }}>
        {title}
      </div>
    </div>
  )

  const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: 13,
  }
  const thStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase',
    color: 'rgba(245,245,245,0.38)', textAlign: 'left', padding: '14px 16px', whiteSpace: 'nowrap',
    borderBottom: '1px solid rgba(160,168,184,0.14)',
  }
  const tdStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)', color: '#F2F4F2', padding: '15px 16px', whiteSpace: 'nowrap',
    borderBottom: '1px solid rgba(160,168,184,0.07)',
  }
  const mono = { fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.04em' } as const

  const renderFeedRow = (
    name: string,
    sub: string,
    status: string,
    key: string,
  ) => (
    <div
      key={key}
      className="admin-row-in"
      style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
        borderRadius: 12, transition: 'background 0.2s ease', cursor: 'default',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(57,255,122,0.06)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
    >
      <Avatar name={name} size={30} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600, color: '#F2F4F2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {name}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.04em', color: 'rgba(245,245,245,0.4)', marginTop: 4 }}>
          {sub}
        </div>
      </div>
      <StatusChip status={status} />
    </div>
  )

  const btnHover = (active: boolean) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => { if (!active) e.currentTarget.style.borderColor = 'rgba(57,255,122,0.3)' },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => { if (!active) e.currentTarget.style.borderColor = 'rgba(160,168,184,0.2)' },
  })

  const CSV_ICON = <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
  const FILTER_ICON = <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
  const HISTORY_ICON = <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>

  return (
    <div className={'admin-dashboard' + (darkMode ? '' : ' admin-dashboard-light')} style={{ minHeight: '100vh', color: '#F2F4F2', position: 'relative', overflow: 'hidden' }}>
      {/* Pitch geometry overlay */}
      <div className="admin-pitch-overlay">
        <svg viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
          <circle cx="720" cy="450" r="120" stroke="#39FF7A" strokeWidth="1.5" />
          <circle cx="720" cy="450" r="6" fill="#39FF7A" />
          <line x1="720" y1="0" x2="720" y2="900" stroke="#39FF7A" strokeWidth="1.2" />
          <rect x="120" y="80" width="1200" height="740" rx="0" stroke="#39FF7A" strokeWidth="1.5" />
          <rect x="120" y="260" width="180" height="380" stroke="#39FF7A" strokeWidth="1.2" />
          <rect x="120" y="350" width="80" height="200" stroke="#39FF7A" strokeWidth="1" />
          <path d="M300 370 A80 80 0 0 1 300 530" stroke="#39FF7A" strokeWidth="1" />
          <circle cx="240" cy="450" r="4" fill="#39FF7A" />
          <rect x="1140" y="260" width="180" height="380" stroke="#39FF7A" strokeWidth="1.2" />
          <rect x="1240" y="350" width="80" height="200" stroke="#39FF7A" strokeWidth="1" />
          <path d="M1140 370 A80 80 0 0 0 1140 530" stroke="#39FF7A" strokeWidth="1" />
          <circle cx="1200" cy="450" r="4" fill="#39FF7A" />
          <path d="M120 100 A20 20 0 0 0 140 80" stroke="#39FF7A" strokeWidth="1" />
          <path d="M1300 80 A20 20 0 0 0 1320 100" stroke="#39FF7A" strokeWidth="1" />
          <path d="M120 800 A20 20 0 0 1 140 820" stroke="#39FF7A" strokeWidth="1" />
          <path d="M1300 820 A20 20 0 0 1 1320 800" stroke="#39FF7A" strokeWidth="1" />
          <line x1="120" y1="80" x2="720" y2="450" stroke="#39FF7A" strokeWidth="0.6" opacity="0.5" />
          <line x1="1320" y1="80" x2="720" y2="450" stroke="#39FF7A" strokeWidth="0.6" opacity="0.5" />
          <line x1="120" y1="820" x2="720" y2="450" stroke="#39FF7A" strokeWidth="0.6" opacity="0.5" />
          <line x1="1320" y1="820" x2="720" y2="450" stroke="#39FF7A" strokeWidth="0.6" opacity="0.5" />
          <line x1="600" y1="450" x2="840" y2="450" stroke="#39FF7A" strokeWidth="0.8" opacity="0.4" />
          <line x1="360" y1="80" x2="360" y2="820" stroke="#39FF7A" strokeWidth="0.5" opacity="0.3" />
          <line x1="1080" y1="80" x2="1080" y2="820" stroke="#39FF7A" strokeWidth="0.5" opacity="0.3" />
        </svg>
      </div>

      <div className="admin-glow admin-glow-pulse" style={{ top: -120, left: '20%', width: 700, height: 700, background: 'radial-gradient(circle, rgba(57,255,122,0.14), transparent 65%)' }} />
      <div className="admin-glow" style={{ bottom: -100, right: '-5%', width: 650, height: 650, background: 'radial-gradient(circle, rgba(23,107,2,0.12), transparent 60%)' }} />
      <div className="admin-glow" style={{ top: '40%', left: '-8%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(57,255,122,0.08), transparent 60%)' }} />
      <div className="admin-vignette" />

      {/* Header */}
      <header style={{ position: 'relative', zIndex: 20, background: 'rgba(3,21,37,0.9)', borderBottom: '1px solid rgba(160,168,184,0.12)', backdropFilter: 'blur(18px)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 28px', height: 78, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src={logoTagline} alt="TURFON24 — Premium Turfs 24/7" style={{ height: 44, width: 'auto', maxWidth: 'none', display: 'block' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="admin-mobile-menu-trigger"
              aria-label="Open navigation menu"
              aria-expanded={mobileNavOpen}
              aria-controls="admin-navigation"
              onClick={() => setMobileNavOpen(open => !open)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.1em', color: 'rgba(245,245,245,0.6)', padding: '9px 14px', border: '1px solid rgba(160,168,184,0.16)', borderRadius: 10, background: 'rgba(11,24,36,0.5)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: ACCENT }}>
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M8 2v4M16 2v4M3 10h18" />
              </svg>
              {today}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: ACCENT, padding: '9px 14px', border: '1px solid rgba(57,255,122,0.25)', borderRadius: 10, background: 'rgba(57,255,122,0.07)' }}>
              <span className="admin-live-dot" style={{ background: ACCENT, boxShadow: `0 0 9px ${ACCENT}` }} />
              Live
            </div>
            <a href="/" className="admin-card" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.75)', textDecoration: 'none', padding: '10px 16px', borderRadius: 10, border: '1px solid rgba(160,168,184,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2M21 12l-2-2M5 10l14 0M5 10a7 7 0 0114 0M5 10v0M19 10v0" /><circle cx="12" cy="16" r="2" /></svg>
              View Site
            </a>
            <button onClick={onLogout} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#030607', background: 'linear-gradient(135deg, #0FA857, #39FF7A)', border: 'none', borderRadius: 10, padding: '11px 18px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 26px rgba(15,168,87,0.35)', transition: 'all 0.25s ease', display: 'flex', alignItems: 'center', gap: 8 }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 34px rgba(57,255,122,0.5)' }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 26px rgba(15,168,87,0.35)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-layout" style={{ position: 'relative', zIndex: 10, maxWidth: 1320, margin: '0 auto', padding: '36px 28px 80px', display: 'grid', gridTemplateColumns: '248px 1fr', gap: 32, alignItems: 'start' }}>
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div id="admin-navigation" className={'admin-nav' + (mobileNavOpen ? ' open' : '')}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.35)', padding: '4px 14px 14px' }}>Navigation</div>
            {NAV_ITEMS.map(n => (
              <button key={n.id} onClick={() => { setSection(n.id); setMobileNavOpen(false) }} className={'admin-nav-item' + (section === n.id ? ' active' : '')} aria-pressed={section === n.id}>
                {n.icon}
                {n.label}
              </button>
            ))}
            <div style={{ marginTop: 14, padding: '14px 14px 8px', borderTop: '1px solid rgba(160,168,184,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.4)' }}>
                <span className="admin-live-dot" style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />
                Systems Operational
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main style={{ minWidth: 0 }}>
          {/* ===== OVERVIEW ===== */}
          {section === 'overview' ? (
            <>
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: ACCENT, marginBottom: 8 }}>Admin · Dashboard</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(34px, 4vw, 52px)', textTransform: 'uppercase', lineHeight: 0.95, color: '#F2F4F2' }}>Dashboard <span style={{ color: ACCENT }}>Overview.</span></div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(245,245,245,0.5)', margin: '12px 0 0', lineHeight: 1.6 }}>Monitor bookings, revenue, and customer activity in real time.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 28 }}>
                {stats.map(s => (
                  <div key={s.label} className="admin-card admin-row-in" style={{ padding: '26px 22px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.45)', marginBottom: 16 }}>{s.label}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 44, lineHeight: 1, color: '#F2F4F2', marginBottom: 14 }}>{s.value}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', color: ACCENT, marginTop: 'auto' }}>
                      <span style={{ fontSize: 12 }}>↑</span>
                      <span style={{ fontWeight: 600 }}>{s.trend}</span>
                      <span style={{ color: 'rgba(245,245,245,0.4)' }}>{s.trendLabel}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="admin-card admin-row-in" style={{ marginBottom: 28, padding: '28px 26px', background: 'linear-gradient(135deg, rgba(57,255,122,0.14), rgba(11,24,36,0.7) 60%)', border: '1px solid rgba(57,255,122,0.35)', boxShadow: '0 20px 50px rgba(0,0,0,0.4), 0 0 42px rgba(57,255,122,0.14)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.55)', marginBottom: 14 }}>Total Revenue · Confirmed</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(44px, 6vw, 72px)', lineHeight: 1, color: ACCENT, textShadow: '0 0 34px rgba(57,255,122,0.4)' }}>₹{totalRevenue.toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', color: ACCENT, border: '1px solid rgba(57,255,122,0.35)', borderRadius: 999, padding: '8px 14px', background: 'rgba(57,255,122,0.08)', marginBottom: 10 }}><span style={{ fontSize: 13 }}>↑</span> +18% this month</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.1em', color: 'rgba(245,245,245,0.4)' }}>Hourly ₹{revenue.toLocaleString()} · Extended ₹{extendedRevenue.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              <div className="resp-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="admin-card admin-row-in" style={{ padding: '22px 16px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px 16px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#F2F4F2' }}>Recent Hourly</div>
                    <span className="admin-chip" style={{ color: ACCENT, background: 'rgba(57,255,122,0.08)', borderColor: 'rgba(57,255,122,0.3)' }}>{HOURLY.length} total</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {HOURLY.slice(0, 4).map(b => renderFeedRow(b.customer, `${b.date} · ${b.start} – ${b.end} · ${b.duration}H`, b.status, b.id))}
                  </div>
                </div>
                <div className="admin-card admin-row-in" style={{ padding: '22px 16px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px 16px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#F2F4F2' }}>Recent Extended</div>
                    <span className="admin-chip" style={{ color: ACCENT, background: 'rgba(57,255,122,0.08)', borderColor: 'rgba(57,255,122,0.3)' }}>{ALL_EXTENDED.length} total</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {ALL_EXTENDED.slice(0, 4).map(b => renderFeedRow(b.customer, `${b.startDate} → ${b.endDate} · ${b.startTime}`, b.status === 'New' || b.status === 'NEW' ? 'Pending' : b.status, b.id))}
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {/* ===== HOURLY BOOKINGS ===== */}
          {section === 'hourly' ? (
            (() => {
              const currentHourly = HOURLY.filter(b => b.status === 'Confirmed')
              const historyHourly = HOURLY.filter(b => b.status === 'Completed' || b.status === 'Cancelled')
              const baseHourly = hourlyView === 'current' ? currentHourly : historyHourly
              const filteredHourly = hourlyFilterDate
                ? baseHourly.filter(b => parseBookingDate(b.date) === hourlyFilterDate)
                : baseHourly

              return (
                <>
                  <SectionHeader eyebrow="Bookings · Hourly" title="Hourly bookings." />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                    <button onClick={() => setHourlyView('current')} style={btnStyle(hourlyView === 'current')} {...btnHover(hourlyView === 'current')}>Current Bookings</button>
                    <button onClick={() => setHourlyView('history')} style={btnStyle(hourlyView === 'history')} {...btnHover(hourlyView === 'history')}>{HISTORY_ICON} Booking History</button>
                    <button onClick={() => setHourlyFilterOpen(!hourlyFilterOpen)} style={btnStyle(!!hourlyFilterDate)} {...btnHover(!!hourlyFilterDate)}>{FILTER_ICON} Filter</button>
                    <button onClick={() => exportCSV(['Customer Name', 'Date', 'Start Time', 'End Time', 'Duration', 'Status'], filteredHourly.map(b => [b.customer, b.date, b.start, b.end, `${b.duration}H`, b.status]), 'hourly-bookings.csv')} style={btnStyle(false)}>{CSV_ICON} Export CSV</button>
                  </div>
                  {hourlyFilterOpen && (
                    <div className="admin-card" style={{ padding: 20, marginBottom: 20, maxWidth: 320, position: 'relative', zIndex: 15 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(245,245,245,0.55)', marginBottom: 14 }}>Filter by Date</div>
                      <input type="date" value={hourlyFilterDate} onChange={e => setHourlyFilterDate(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'rgba(11,24,36,0.8)', border: '1px solid rgba(57,255,122,0.3)', borderRadius: 8, color: '#F2F4F2', fontFamily: 'var(--font-mono)', fontSize: 12, boxSizing: 'border-box' as const, marginBottom: 14, outline: 'none' }} />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setHourlyFilterOpen(false)} style={{ flex: 1, padding: '9px 14px', background: 'rgba(57,255,122,0.1)', border: '1px solid rgba(57,255,122,0.3)', borderRadius: 8, color: ACCENT, fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer', transition: 'all 0.2s ease' }}>Apply Filter</button>
                        {hourlyFilterDate && <button onClick={() => { setHourlyFilterDate(''); setHourlyFilterOpen(false) }} style={{ flex: 1, padding: '9px 14px', background: 'rgba(160,168,184,0.1)', border: '1px solid rgba(160,168,184,0.2)', borderRadius: 8, color: 'rgba(245,245,245,0.6)', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer', transition: 'all 0.2s ease' }}>Clear Filter</button>}
                      </div>
                    </div>
                  )}
                  {hourlyFilterDate && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: ACCENT }}>
                      Filter: {formatFilterDate(hourlyFilterDate)}
                      <span onClick={() => setHourlyFilterDate('')} style={{ cursor: 'pointer', color: 'rgba(245,245,245,0.5)', fontSize: 14, lineHeight: 1 }}>×</span>
                    </div>
                  )}
                  <div className="admin-card admin-row-in" style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(245,245,245,0.55)' }}>{hourlyView === 'current' ? 'Current Hourly Bookings' : 'Booking History'}</div>
                      <span className="admin-chip" style={{ color: ACCENT, background: 'rgba(57,255,122,0.08)', borderColor: 'rgba(57,255,122,0.3)' }}>{filteredHourly.length} {hourlyFilterDate ? 'results' : 'total'}</span>
                    </div>
                    {filteredHourly.length === 0 ? (
                      <div style={{ padding: '48px 0', textAlign: 'center' as const }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase' as const, color: 'rgba(245,245,245,0.35)', marginBottom: 8 }}>No Bookings Found</div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(245,245,245,0.3)', marginBottom: 20 }}>No bookings are available for {hourlyFilterDate ? formatFilterDate(hourlyFilterDate) : 'this view'}.</div>
                        {hourlyFilterDate && <button onClick={() => setHourlyFilterDate('')} style={{ padding: '9px 18px', background: 'rgba(57,255,122,0.1)', border: '1px solid rgba(57,255,122,0.3)', borderRadius: 8, color: ACCENT, fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer', transition: 'all 0.2s ease' }}>Clear Filter</button>}
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={tableStyles}>
                          <thead><tr>
                            <th style={thStyle}>Customer</th>
                            <th style={thStyle}>Date</th>
                            <th style={thStyle}>Time</th>
                            <th style={thStyle}>Duration</th>
                            <th style={{ ...thStyle, textAlign: 'right' }}>Status</th>
                          </tr></thead>
                          <tbody>
                            {filteredHourly.map(b => (
                              <tr key={b.id} style={{ transition: 'background 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(57,255,122,0.05)' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                                <td style={tdStyle}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={b.customer} size={30} />{b.customer}</div></td>
                                <td style={{ ...tdStyle, ...mono, fontSize: 11 }}>{b.date}</td>
                                <td style={{ ...tdStyle, ...mono, fontSize: 11 }}>{b.start} – {b.end}</td>
                                <td style={{ ...tdStyle, ...mono, fontSize: 11 }}>{b.duration}H</td>
                                <td style={{ ...tdStyle, textAlign: 'right' }}><StatusChip status={b.status} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )
            })()
          ) : null}

          {/* ===== EXTENDED BOOKINGS ===== */}
          {section === 'extended' ? (
            (() => {
              const extStatus = (b: ExtendedBooking): string => b.status === 'New' || b.status === 'NEW' ? 'Pending' : b.status
              const currentExtended = ALL_EXTENDED.filter(b => extStatus(b) === 'Pending')
              const historyExtended = ALL_EXTENDED.filter(b => extStatus(b) === 'Confirmed' || extStatus(b) === 'Completed' || extStatus(b) === 'Cancelled' || extStatus(b) === 'Expired')
              const baseExtended = extendedView === 'current' ? currentExtended : historyExtended
              const hasActiveFilters = !!(extendedFilterDateFrom || extendedFilterDateTo || extendedFilterStatus || extendedFilterName || extendedFilterPhone)
              const filteredExtended = baseExtended.filter(b => {
                if (extendedFilterName && !b.customer.toLowerCase().includes(extendedFilterName.toLowerCase())) return false
                if (extendedFilterPhone && !b.phone.includes(extendedFilterPhone)) return false
                if (extendedFilterStatus && extStatus(b) !== extendedFilterStatus) return false
                if (extendedFilterDateFrom || extendedFilterDateTo) {
                  const bookingDate = parseBookingDate(b.startDate)
                  if (extendedFilterDateFrom && bookingDate < extendedFilterDateFrom) return false
                  if (extendedFilterDateTo && bookingDate > extendedFilterDateTo) return false
                }
                return true
              })
              const clearAllFilters = () => {
                setExtendedFilterDateFrom('')
                setExtendedFilterDateTo('')
                setExtendedFilterStatus('')
                setExtendedFilterName('')
                setExtendedFilterPhone('')
                setExtendedFilterOpen(false)
              }

              return (
                <>
                  <SectionHeader eyebrow="Bookings · Extended" title="Extended bookings." />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                    <button onClick={() => setExtendedView('current')} style={btnStyle(extendedView === 'current')} {...btnHover(extendedView === 'current')}>Current Bookings</button>
                    <button onClick={() => setExtendedView('history')} style={btnStyle(extendedView === 'history')} {...btnHover(extendedView === 'history')}>{HISTORY_ICON} Booking History</button>
                    <button onClick={() => setExtendedFilterOpen(!extendedFilterOpen)} style={btnStyle(extendedFilterOpen || hasActiveFilters)} {...btnHover(extendedFilterOpen || hasActiveFilters)}>{FILTER_ICON} Filter</button>
                    <button onClick={() => {
                      exportCSV(
                        ['Customer Name', 'Phone Number', 'Start Date', 'Start Time', 'End Date', 'End Time', 'Players', 'Enquiry Message', 'Status', 'Created Date'],
                        filteredExtended.map(b => [b.customer, b.phone, b.startDate, b.startTime, b.endDate, b.endTime, b.players, b.requirements, extStatus(b), b.submittedAt]),
                        'extended-bookings.csv'
                      )
                    }} style={btnStyle(false)}>{CSV_ICON} Export CSV</button>
                  </div>
                  {extendedFilterOpen && (
                    <div className="admin-card" style={{ padding: 20, marginBottom: 20, position: 'relative', zIndex: 15 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(245,245,245,0.55)', marginBottom: 16 }}>Filter Bookings</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 16 }}>
                        <div>
                          <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'rgba(245,245,245,0.4)', marginBottom: 6 }}>Customer Name</label>
                          <input type="text" placeholder="Search name..." value={extendedFilterName} onChange={e => setExtendedFilterName(e.target.value)} style={{ width: '100%', padding: '9px 12px', background: 'rgba(11,24,36,0.8)', border: '1px solid rgba(57,255,122,0.25)', borderRadius: 8, color: '#F2F4F2', fontFamily: 'var(--font-mono)', fontSize: 11, boxSizing: 'border-box' as const, outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'rgba(245,245,245,0.4)', marginBottom: 6 }}>Phone Number</label>
                          <input type="text" placeholder="Search phone..." value={extendedFilterPhone} onChange={e => setExtendedFilterPhone(e.target.value)} style={{ width: '100%', padding: '9px 12px', background: 'rgba(11,24,36,0.8)', border: '1px solid rgba(57,255,122,0.25)', borderRadius: 8, color: '#F2F4F2', fontFamily: 'var(--font-mono)', fontSize: 11, boxSizing: 'border-box' as const, outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'rgba(245,245,245,0.4)', marginBottom: 6 }}>Date From</label>
                          <input type="date" value={extendedFilterDateFrom} onChange={e => setExtendedFilterDateFrom(e.target.value)} style={{ width: '100%', padding: '9px 12px', background: 'rgba(11,24,36,0.8)', border: '1px solid rgba(57,255,122,0.25)', borderRadius: 8, color: '#F2F4F2', fontFamily: 'var(--font-mono)', fontSize: 11, boxSizing: 'border-box' as const, outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'rgba(245,245,245,0.4)', marginBottom: 6 }}>Date To</label>
                          <input type="date" value={extendedFilterDateTo} onChange={e => setExtendedFilterDateTo(e.target.value)} style={{ width: '100%', padding: '9px 12px', background: 'rgba(11,24,36,0.8)', border: '1px solid rgba(57,255,122,0.25)', borderRadius: 8, color: '#F2F4F2', fontFamily: 'var(--font-mono)', fontSize: 11, boxSizing: 'border-box' as const, outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'rgba(245,245,245,0.4)', marginBottom: 6 }}>Status</label>
                          <select value={extendedFilterStatus} onChange={e => setExtendedFilterStatus(e.target.value)} style={{ width: '100%', padding: '9px 12px', background: 'rgba(11,24,36,0.8)', border: '1px solid rgba(57,255,122,0.25)', borderRadius: 8, color: '#F2F4F2', fontFamily: 'var(--font-mono)', fontSize: 11, boxSizing: 'border-box' as const, outline: 'none', cursor: 'pointer' }}>
                            <option value="">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Expired">Expired</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setExtendedFilterOpen(false)} style={{ padding: '9px 14px', background: 'rgba(57,255,122,0.1)', border: '1px solid rgba(57,255,122,0.3)', borderRadius: 8, color: ACCENT, fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer', transition: 'all 0.2s ease' }}>Apply Filter</button>
                        {hasActiveFilters && <button onClick={clearAllFilters} style={{ padding: '9px 14px', background: 'rgba(160,168,184,0.1)', border: '1px solid rgba(160,168,184,0.2)', borderRadius: 8, color: 'rgba(245,245,245,0.6)', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer', transition: 'all 0.2s ease' }}>Clear All</button>}
                      </div>
                    </div>
                  )}
                  {hasActiveFilters && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: ACCENT, flexWrap: 'wrap' }}>
                      Active Filters:
                      {extendedFilterName && <span className="admin-chip" style={{ padding: '4px 10px', background: 'rgba(57,255,122,0.08)', borderColor: 'rgba(57,255,122,0.3)', cursor: 'pointer', fontSize: 9 }} onClick={() => setExtendedFilterName('')}>{extendedFilterName} ×</span>}
                      {extendedFilterPhone && <span className="admin-chip" style={{ padding: '4px 10px', background: 'rgba(57,255,122,0.08)', borderColor: 'rgba(57,255,122,0.3)', cursor: 'pointer', fontSize: 9 }} onClick={() => setExtendedFilterPhone('')}>{extendedFilterPhone} ×</span>}
                      {extendedFilterStatus && <span className="admin-chip" style={{ padding: '4px 10px', background: 'rgba(57,255,122,0.08)', borderColor: 'rgba(57,255,122,0.3)', cursor: 'pointer', fontSize: 9 }} onClick={() => setExtendedFilterStatus('')}>{extendedFilterStatus} ×</span>}
                      {(extendedFilterDateFrom || extendedFilterDateTo) && <span className="admin-chip" style={{ padding: '4px 10px', background: 'rgba(57,255,122,0.08)', borderColor: 'rgba(57,255,122,0.3)', cursor: 'pointer', fontSize: 9 }} onClick={() => { setExtendedFilterDateFrom(''); setExtendedFilterDateTo('') }}>{formatFilterDate(extendedFilterDateFrom) || '...'} – {formatFilterDate(extendedFilterDateTo) || '...'} ×</span>}
                    </div>
                  )}
                  <div className="admin-card admin-row-in" style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(245,245,245,0.55)' }}>{extendedView === 'current' ? 'Current Extended Bookings' : 'Booking History'}</div>
                      <span className="admin-chip" style={{ color: ACCENT, background: 'rgba(57,255,122,0.08)', borderColor: 'rgba(57,255,122,0.3)' }}>{filteredExtended.length} {hasActiveFilters ? 'results' : 'total'}</span>
                    </div>
                    {filteredExtended.length === 0 ? (
                      <div style={{ padding: '48px 0', textAlign: 'center' as const }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase' as const, color: 'rgba(245,245,245,0.35)', marginBottom: 8 }}>No Bookings Found</div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(245,245,245,0.3)', marginBottom: 20 }}>{hasActiveFilters ? 'No bookings match the applied filters.' : 'No bookings are available for this view.'}</div>
                        {hasActiveFilters && <button onClick={clearAllFilters} style={{ padding: '9px 18px', background: 'rgba(57,255,122,0.1)', border: '1px solid rgba(57,255,122,0.3)', borderRadius: 8, color: ACCENT, fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, cursor: 'pointer', transition: 'all 0.2s ease' }}>Clear Filters</button>}
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={tableStyles}>
                          <thead><tr>
                            <th style={thStyle}>Customer Name</th>
                            <th style={thStyle}>Phone Number</th>
                            <th style={thStyle}>Start Date & Time</th>
                            <th style={thStyle}>End Date & Time</th>
                            <th style={thStyle}>Players</th>
                            <th style={thStyle}>Enquiry Message</th>
                            <th style={{ ...thStyle, textAlign: 'right' }}>Status</th>
                          </tr></thead>
                          <tbody>
                            {filteredExtended.map(b => {
                              const truncatedMsg = b.requirements.length > 55 ? b.requirements.slice(0, 55) + '...' : b.requirements
                              return (
                                <tr key={b.id} style={{ transition: 'background 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(57,255,122,0.05)' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                                  <td style={tdStyle}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={b.customer} size={30} /><span style={{ whiteSpace: 'nowrap' }}>{b.customer}</span></div></td>
                                  <td style={{ ...tdStyle, ...mono, color: ACCENT, fontSize: 11 }}>{b.phone}</td>
                                  <td style={{ ...tdStyle, ...mono, fontSize: 11 }}><div>{b.startDate}</div><div style={{ color: 'rgba(245,245,245,0.5)', marginTop: 2 }}>{b.startTime}</div></td>
                                  <td style={{ ...tdStyle, ...mono, fontSize: 11 }}><div>{b.endDate}</div><div style={{ color: 'rgba(245,245,245,0.5)', marginTop: 2 }}>{b.endTime}</div></td>
                                  <td style={{ ...tdStyle, ...mono, fontSize: 11 }}>{b.players} Players</td>
                                  <td style={{ ...tdStyle, fontSize: 11, maxWidth: 220 }}>
                                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, color: 'rgba(245,245,245,0.65)' }}>"{truncatedMsg}"</div>
                                    {b.requirements.length > 55 && (
                                      <button onClick={() => setMessageModal({ customer: b.customer, message: b.requirements })} style={{ marginTop: 4, background: 'none', border: 'none', padding: 0, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: ACCENT, cursor: 'pointer', fontWeight: 600, transition: 'opacity 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.opacity = '0.7' }} onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>View More</button>
                                    )}
                                  </td>
                                  <td style={{ ...tdStyle, textAlign: 'right' }}><StatusChip status={extStatus(b)} /></td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )
            })()
          ) : null}

          {/* ===== CONTACT LEADS ===== */}
          {section === 'contact-leads' ? (
            (() => {
              const filteredLeads = contactFilter
                ? contactLeads.filter(l => l.status === contactFilter)
                : contactLeads
              return (
                <>
                  <SectionHeader eyebrow="Admin · Leads" title="Contact leads." />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                    {['', 'New', 'Contacted', 'Closed'].map(s => (
                      <button key={s || 'all'} onClick={() => setContactFilter(s)} style={btnStyle(contactFilter === s)} {...btnHover(contactFilter === s)}>{s || 'All Leads'}</button>
                    ))}
                  </div>
                  <div className="admin-card admin-row-in" style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(245,245,245,0.55)' }}>All Contact Leads</div>
                      <span className="admin-chip" style={{ color: ACCENT, background: 'rgba(57,255,122,0.08)', borderColor: 'rgba(57,255,122,0.3)' }}>{filteredLeads.length} total</span>
                    </div>
                    {filteredLeads.length === 0 ? (
                      <div style={{ padding: '48px 0', textAlign: 'center' as const }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase' as const, color: 'rgba(245,245,245,0.35)', marginBottom: 8 }}>No Contact Leads</div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(245,245,245,0.3)' }}>No contact form submissions yet. Leads will appear here when customers submit the contact form.</div>
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={tableStyles}>
                          <thead><tr>
                            <th style={thStyle}>Name</th>
                            <th style={thStyle}>Phone</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Message</th>
                            <th style={thStyle}>Submitted</th>
                            <th style={thStyle}>Status</th>
                          </tr></thead>
                          <tbody>
                            {filteredLeads.map(l => (
                              <tr key={l.id} style={{ transition: 'background 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(57,255,122,0.05)' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                                <td style={tdStyle}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={l.name} size={30} />{l.name}</div></td>
                                <td style={{ ...tdStyle, ...mono, color: ACCENT, fontSize: 11 }}>{l.phone}</td>
                                <td style={{ ...tdStyle, ...mono, fontSize: 11 }}>{l.email}</td>
                                <td style={{ ...tdStyle, fontSize: 11, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{l.message}</td>
                                <td style={{ ...tdStyle, ...mono, fontSize: 11, color: 'rgba(245,245,245,0.55)' }}>{l.submittedAt}</td>
                                <td style={tdStyle}>
                                  <select value={l.status} onChange={e => {
                                    const val = e.target.value as ContactLead['status']
                                    updateContactLeadStatus(l.id, val)
                                    setContactLeads(prev => prev.map(cl => cl.id === l.id ? { ...cl, status: val } : cl))
                                  }} style={{ background: 'rgba(11,24,36,0.8)', border: `1px solid ${STATUS_COLORS[l.status] || '#A0A8B8'}3D`, borderRadius: 8, color: STATUS_COLORS[l.status] || '#A0A8B8', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '6px 10px', cursor: 'pointer', outline: 'none' }}>
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Closed">Closed</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )
            })()
          ) : null}

          {/* ===== CUSTOMERS ===== */}
          {section === 'customers' ? (
            <>
              <SectionHeader eyebrow="Directory" title="Customers." />
              
              {/* Toggle & Totals */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
                <div className="admin-card admin-row-in" style={{ padding: '20px 22px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.55)', marginBottom: 12 }}>Hourly Bookings Total</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 42px)', color: '#39FF7A', lineHeight: 1 }}>₹{revenue.toLocaleString()}</div>
                </div>
                <div className="admin-card admin-row-in" style={{ padding: '20px 22px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.55)', marginBottom: 12 }}>Extended Bookings Total</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 42px)', color: '#00C9FF', lineHeight: 1 }}>₹{extendedRevenue.toLocaleString()}</div>
                </div>
              </div>

              {/* View Toggle */}
              <div style={{ marginBottom: 28, display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setCustomerView('hourly')}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 10,
                    border: '1px solid',
                    borderColor: customerView === 'hourly' ? '#39FF7A' : 'rgba(160,168,184,0.2)',
                    background: customerView === 'hourly' ? 'rgba(57,255,122,0.1)' : 'transparent',
                    color: customerView === 'hourly' ? '#39FF7A' : 'rgba(245,245,245,0.6)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(57,255,122,0.1)' }}
                  onMouseLeave={e => { if (customerView !== 'hourly') e.currentTarget.style.background = 'transparent' }}
                >
                  Hourly Booking Customers
                </button>
                <button
                  onClick={() => setCustomerView('extended')}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 10,
                    border: '1px solid',
                    borderColor: customerView === 'extended' ? '#00C9FF' : 'rgba(160,168,184,0.2)',
                    background: customerView === 'extended' ? 'rgba(0,201,255,0.1)' : 'transparent',
                    color: customerView === 'extended' ? '#00C9FF' : 'rgba(245,245,245,0.6)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,201,255,0.1)' }}
                  onMouseLeave={e => { if (customerView !== 'extended') e.currentTarget.style.background = 'transparent' }}
                >
                  Extended Booking Customers
                </button>
              </div>

              {/* Customers Table */}
              <div className="admin-card admin-row-in" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px', borderBottom: '1px solid rgba(160,168,184,0.12)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.55)' }}>Customer Directory</div>
                  <span className="admin-chip" style={{ color: customerView === 'hourly' ? '#39FF7A' : '#00C9FF', background: customerView === 'hourly' ? 'rgba(57,255,122,0.08)' : 'rgba(0,201,255,0.08)', borderColor: customerView === 'hourly' ? 'rgba(57,255,122,0.3)' : 'rgba(0,201,255,0.3)' }}>{(customerView === 'hourly' ? CUSTOMERS.slice(0, 8) : CUSTOMERS.slice(8)).length} customers</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={tableStyles}>
                    <thead><tr><th style={thStyle}>#</th><th style={thStyle}>Name</th><th style={thStyle}>Mobile Number</th><th style={thStyle}>Bookings</th><th style={thStyle}>Amount Spent</th><th style={thStyle}>Last Booking</th></tr></thead>
                    <tbody>
                      {(customerView === 'hourly' ? CUSTOMERS.slice(0, 8) : CUSTOMERS.slice(8)).map((c, i) => (
                        <tr key={c.phone} style={{ transition: 'background 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(57,255,122,0.05)' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                          <td style={{ ...tdStyle, ...mono, color: 'rgba(245,245,245,0.35)' }}>{String(i + 1).padStart(2, '0')}</td>
                          <td style={tdStyle}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={c.name} size={30} />{c.name}</div></td>
                          <td style={{ ...tdStyle, ...mono, color: customerView === 'hourly' ? '#39FF7A' : '#00C9FF' }}>{c.phone}</td>
                          <td style={{ ...tdStyle, ...mono, fontSize: 11 }}>{c.bookings}</td>
                          <td style={{ ...tdStyle, ...mono, fontSize: 11 }}>₹{c.total.toLocaleString()}</td>
                          <td style={{ ...tdStyle, ...mono, fontSize: 11, color: 'rgba(245,245,245,0.55)' }}>{c.lastBooking}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}

          {/* ===== SETTINGS ===== */}
          {section === 'settings' ? (
            <>
              <SectionHeader eyebrow="Admin · Settings" title="Settings." />
              <div className="resp-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="admin-card admin-row-in" style={{ padding: '28px 26px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#F2F4F2', marginBottom: 6 }}>Theme Appearance</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(245,245,245,0.5)' }}>Switch between dark and normal mode</div>
                    </div>
                  </div>
                  <div className="admin-theme-switcher">
                    <button type="button" className={!darkMode ? 'active' : ''} onClick={() => setDarkMode(false)}>Normal Mode</button>
                    <button type="button" className={darkMode ? 'active' : ''} onClick={() => setDarkMode(true)}>Dark Mode</button>
                  </div>
                </div>
                <div className="admin-card admin-row-in" style={{ padding: '28px 26px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#F2F4F2', marginBottom: 6 }}>Block Online Bookings</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(245,245,245,0.5)' }}>Prevent customers from booking online</div>
                    </div>
                  </div>
                  <div style={{ padding: '20px 16px', background: 'rgba(255,107,107,0.06)', borderRadius: 10, border: '1px solid rgba(255,107,107,0.2)', marginBottom: 20 }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(245,245,245,0.5)', textAlign: 'center' }}>Online bookings are currently enabled</div>
                  </div>
                  <button style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.4)', borderRadius: 10, color: '#FF6B6B', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.25s ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.25)' }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.15)' }}>✕ Block Bookings</button>
                </div>
                <div className="admin-card admin-row-in" style={{ padding: '28px 26px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#F2F4F2', marginBottom: 6 }}>Change ID Password</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(245,245,245,0.5)' }}>Update your admin credentials</div>
                    </div>
                  </div>
                  {!showPasswordForm ? (
                    <button onClick={() => setShowPasswordForm(true)} style={{ width: '100%', padding: '12px 16px', background: 'rgba(57,255,122,0.1)', border: '1px solid rgba(57,255,122,0.3)', borderRadius: 10, color: ACCENT, fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(57,255,122,0.15)' }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(57,255,122,0.1)' }}>Change Password</button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.55)', marginBottom: 6 }}>Current Password</label>
                        <input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} style={{ width: '100%', padding: '10px 12px', background: 'rgba(11,24,36,0.8)', border: '1px solid rgba(160,168,184,0.2)', borderRadius: 8, color: '#F2F4F2', fontFamily: 'var(--font-body)', fontSize: 13, boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.55)', marginBottom: 6 }}>New Password</label>
                        <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} style={{ width: '100%', padding: '10px 12px', background: 'rgba(11,24,36,0.8)', border: '1px solid rgba(160,168,184,0.2)', borderRadius: 8, color: '#F2F4F2', fontFamily: 'var(--font-body)', fontSize: 13, boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.55)', marginBottom: 6 }}>Confirm Password</label>
                        <input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} style={{ width: '100%', padding: '10px 12px', background: 'rgba(11,24,36,0.8)', border: '1px solid rgba(160,168,184,0.2)', borderRadius: 8, color: '#F2F4F2', fontFamily: 'var(--font-body)', fontSize: 13, boxSizing: 'border-box' }} />
                      </div>
                      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                        <button onClick={() => { if (passwordForm.newPassword !== passwordForm.confirmPassword) { alert('Passwords do not match'); return } alert('Password changed successfully'); setShowPasswordForm(false); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }) }} style={{ flex: 1, padding: '10px 16px', background: 'linear-gradient(135deg, #0FA857, #39FF7A)', border: 'none', borderRadius: 8, color: '#030607', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease' }}>Update Password</button>
                        <button onClick={() => { setShowPasswordForm(false); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }) }} style={{ flex: 1, padding: '10px 16px', background: 'rgba(160,168,184,0.1)', border: '1px solid rgba(160,168,184,0.2)', borderRadius: 8, color: 'rgba(245,245,245,0.6)', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease' }}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
                <GallerySettingsCard />
              </div>
            </>
          ) : null}
        </main>
      </div>

      {/* Enquiry Message Modal */}
      {messageModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setMessageModal(null)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />
          <div className="admin-card" onClick={e => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxWidth: 520, padding: '32px 28px', border: '1px solid rgba(57,255,122,0.3)', boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 48px rgba(57,255,122,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT }}>Enquiry Message</div>
              <button onClick={() => setMessageModal(null)} style={{ background: 'none', border: 'none', color: 'rgba(245,245,245,0.5)', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: 4, transition: 'color 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.color = '#F2F4F2' }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,245,245,0.5)' }}>×</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <Avatar name={messageModal.customer} size={36} />
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#F2F4F2' }}>{messageModal.customer}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.7, color: 'rgba(245,245,245,0.75)', padding: '18px 16px', background: 'rgba(11,24,36,0.6)', borderRadius: 10, border: '1px solid rgba(160,168,184,0.1)' }}>
              "{messageModal.message}"
            </div>
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setMessageModal(null)} style={{ padding: '10px 20px', background: 'rgba(57,255,122,0.1)', border: '1px solid rgba(57,255,122,0.3)', borderRadius: 8, color: ACCENT, fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(57,255,122,0.18)' }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(57,255,122,0.1)' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
