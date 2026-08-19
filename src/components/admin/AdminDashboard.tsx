import { useState } from 'react'
import { getExtendedEnquiries } from '../../services/enquiryStore'

const ACCENT = '#39F72A'
const ACCENT_RGB = '57,247,42'
const logoTagline = '/turfon24-logo-tagline.png'

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

type Section = 'overview' | 'hourly' | 'extended' | 'customers' | 'settings'

const STATUS_COLORS: Record<string, string> = {
  Confirmed: '#39F72A',
  Completed: '#5EA9FF',
  Cancelled: '#FF6B6B',
  Pending: '#F5B84C',
  New: '#39F72A',
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

const today = new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [section, setSection] = useState<Section>('overview')
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  const revenue = HOURLY.filter(b => b.status !== 'Cancelled').reduce((s, b) => s + b.amount, 0)
  const extendedRevenue = ALL_EXTENDED.filter(b => b.status === 'Confirmed').length * 12000
  const totalRevenue = revenue + extendedRevenue

  const stats = [
    { label: 'Total Bookings', value: String(HOURLY.length + ALL_EXTENDED.length), trend: '+12%', trendLabel: 'this month', up: true },
    { label: 'Hourly Bookings', value: String(HOURLY.length), trend: '2', trendLabel: 'active', up: true },
    { label: 'Extended Bookings', value: String(ALL_EXTENDED.length), trend: '2', trendLabel: 'pending', up: true },
    { label: 'Customers', value: String(CUSTOMERS.length), trend: '3', trendLabel: 'new today', up: true },
  ]

  const Avatar = ({ name, size = 36 }: { name: string; size?: number }) => (
    <div
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg, rgba(${ACCENT_RGB},0.22), rgba(${ACCENT_RGB},0.08))`,
        border: '1px solid rgba(57,247,42,0.4)',
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
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(34px, 4vw, 52px)', textTransform: 'uppercase', lineHeight: 0.95, color: '#F5F5F5' }}>
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
    fontFamily: 'var(--font-body)', color: '#F5F5F5', padding: '15px 16px', whiteSpace: 'nowrap',
    borderBottom: '1px solid rgba(160,168,184,0.07)',
  }
  const mono = { fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.04em' } as const

  const renderFeedRow = (
    name: string,
    sub: string,
    status: string,
    key: string,
    right?: React.ReactNode
  ) => (
    <div
      key={key}
      className="admin-row-in"
      style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
        borderRadius: 12, transition: 'background 0.2s ease', cursor: 'default',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(57,247,42,0.06)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
    >
      <Avatar name={name} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600, color: '#F5F5F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {name}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.04em', color: 'rgba(245,245,245,0.4)', marginTop: 4 }}>
          {sub}
        </div>
      </div>
      {right}
      <StatusChip status={status} />
    </div>
  )

  return (
    <div className="admin-dashboard" style={{ minHeight: '100vh', color: '#F5F5F5', position: 'relative', overflow: 'hidden' }}>
      {/* Pitch geometry overlay */}
      <div className="admin-pitch-overlay">
        <svg viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
          {/* Center circle */}
          <circle cx="720" cy="450" r="120" stroke="#39F72A" strokeWidth="1.5" />
          <circle cx="720" cy="450" r="6" fill="#39F72A" />
          {/* Midfield line */}
          <line x1="720" y1="0" x2="720" y2="900" stroke="#39F72A" strokeWidth="1.2" />
          {/* Outer pitch boundary */}
          <rect x="120" y="80" width="1200" height="740" rx="0" stroke="#39F72A" strokeWidth="1.5" />
          {/* Left penalty box */}
          <rect x="120" y="260" width="180" height="380" stroke="#39F72A" strokeWidth="1.2" />
          {/* Left goal box */}
          <rect x="120" y="350" width="80" height="200" stroke="#39F72A" strokeWidth="1" />
          {/* Left penalty arc */}
          <path d="M300 370 A80 80 0 0 1 300 530" stroke="#39F72A" strokeWidth="1" />
          {/* Left penalty spot */}
          <circle cx="240" cy="450" r="4" fill="#39F72A" />
          {/* Right penalty box */}
          <rect x="1140" y="260" width="180" height="380" stroke="#39F72A" strokeWidth="1.2" />
          {/* Right goal box */}
          <rect x="1240" y="350" width="80" height="200" stroke="#39F72A" strokeWidth="1" />
          {/* Right penalty arc */}
          <path d="M1140 370 A80 80 0 0 0 1140 530" stroke="#39F72A" strokeWidth="1" />
          {/* Right penalty spot */}
          <circle cx="1200" cy="450" r="4" fill="#39F72A" />
          {/* Corner arcs */}
          <path d="M120 100 A20 20 0 0 0 140 80" stroke="#39F72A" strokeWidth="1" />
          <path d="M1300 80 A20 20 0 0 0 1320 100" stroke="#39F72A" strokeWidth="1" />
          <path d="M120 800 A20 20 0 0 1 140 820" stroke="#39F72A" strokeWidth="1" />
          <path d="M1300 820 A20 20 0 0 1 1320 800" stroke="#39F72A" strokeWidth="1" />
          {/* Diagonal technical lines */}
          <line x1="120" y1="80" x2="720" y2="450" stroke="#39F72A" strokeWidth="0.6" opacity="0.5" />
          <line x1="1320" y1="80" x2="720" y2="450" stroke="#39F72A" strokeWidth="0.6" opacity="0.5" />
          <line x1="120" y1="820" x2="720" y2="450" stroke="#39F72A" strokeWidth="0.6" opacity="0.5" />
          <line x1="1320" y1="820" x2="720" y2="450" stroke="#39F72A" strokeWidth="0.6" opacity="0.5" />
          {/* Center line horizontal accents */}
          <line x1="600" y1="450" x2="840" y2="450" stroke="#39F72A" strokeWidth="0.8" opacity="0.4" />
          {/* Field zone divisions */}
          <line x1="360" y1="80" x2="360" y2="820" stroke="#39F72A" strokeWidth="0.5" opacity="0.3" />
          <line x1="1080" y1="80" x2="1080" y2="820" stroke="#39F72A" strokeWidth="0.5" opacity="0.3" />
        </svg>
      </div>

      {/* Ambient green glows */}
      <div className="admin-glow admin-glow-pulse" style={{ top: -120, left: '20%', width: 700, height: 700, background: 'radial-gradient(circle, rgba(57,247,42,0.14), transparent 65%)' }} />
      <div className="admin-glow" style={{ bottom: -100, right: '-5%', width: 650, height: 650, background: 'radial-gradient(circle, rgba(23,107,2,0.12), transparent 60%)' }} />
      <div className="admin-glow" style={{ top: '40%', left: '-8%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(57,247,42,0.08), transparent 60%)' }} />

      {/* Vignette */}
      <div className="admin-vignette" />

      {/* Header */}
      <header style={{ position: 'relative', zIndex: 20, background: 'rgba(3,21,37,0.9)', borderBottom: '1px solid rgba(160,168,184,0.12)', backdropFilter: 'blur(18px)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 28px', height: 78, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img
              src={logoTagline}
              alt="TURFON24 — Premium Turfs 24/7"
              style={{ height: 44, width: 'auto', maxWidth: 'none', display: 'block' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.1em', color: 'rgba(245,245,245,0.6)', padding: '9px 14px', border: '1px solid rgba(160,168,184,0.16)', borderRadius: 10, background: 'rgba(11,24,36,0.5)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: ACCENT }}>
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M8 2v4M16 2v4M3 10h18" />
              </svg>
              {today}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: ACCENT, padding: '9px 14px', border: '1px solid rgba(57,247,42,0.25)', borderRadius: 10, background: 'rgba(57,247,42,0.07)' }}>
              <span className="admin-live-dot" style={{ background: ACCENT, boxShadow: `0 0 9px ${ACCENT}` }} />
              Live
            </div>
            <a
              href="/"
              className="admin-card"
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(245,245,245,0.75)', textDecoration: 'none', padding: '10px 16px', borderRadius: 10, border: '1px solid rgba(160,168,184,0.2)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12l2-2M21 12l-2-2M5 10l14 0M5 10a7 7 0 0114 0M5 10v0M19 10v0" />
                <circle cx="12" cy="16" r="2" />
              </svg>
              View Site
            </a>
            <button
              onClick={onLogout}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#000000', background: 'linear-gradient(135deg, #39F72A, #C7F42D)', border: 'none', borderRadius: 10,
                padding: '11px 18px', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 10px 26px rgba(57,247,42,0.35)', transition: 'all 0.25s ease',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 34px rgba(57,247,42,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 26px rgba(57,247,42,0.35)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-layout" style={{ position: 'relative', zIndex: 10, maxWidth: 1320, margin: '0 auto', padding: '36px 28px 80px', display: 'grid', gridTemplateColumns: '248px 1fr', gap: 32, alignItems: 'start' }}>
        {/* Floating nav rail */}
        <aside className="admin-sidebar">
          <div className="admin-nav">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.35)', padding: '4px 14px 14px' }}>
              Navigation
            </div>
            {NAV_ITEMS.map(n => (
              <button
                key={n.id}
                onClick={() => setSection(n.id)}
                className={'admin-nav-item' + (section === n.id ? ' active' : '')}
                aria-pressed={section === n.id}
              >
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
          {/* Overview */}
          {section === 'overview' ? (
            <>
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: ACCENT, marginBottom: 8 }}>
                  Admin · Dashboard
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(34px, 4vw, 52px)', textTransform: 'uppercase', lineHeight: 0.95, color: '#F5F5F5' }}>
                  Dashboard <span style={{ color: ACCENT }}>Overview.</span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(245,245,245,0.5)', margin: '12px 0 0', lineHeight: 1.6 }}>
                  Monitor bookings, revenue, and customer activity in real time.
                </p>
              </div>

              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 28 }}>
                {stats.map(s => (
                  <div key={s.label} className="admin-card admin-row-in" style={{ padding: '26px 22px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.45)', marginBottom: 16 }}>
                      {s.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 44, lineHeight: 1, color: '#F5F5F5', marginBottom: 14 }}>
                      {s.value}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', color: ACCENT, marginTop: 'auto' }}>
                      <span style={{ fontSize: 12 }}>↑</span>
                      <span style={{ fontWeight: 600 }}>{s.trend}</span>
                      <span style={{ color: 'rgba(245,245,245,0.4)' }}>{s.trendLabel}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Revenue highlight card */}
              <div className="admin-card admin-row-in" style={{ marginBottom: 28, padding: '28px 26px', background: 'linear-gradient(135deg, rgba(57,247,42,0.14), rgba(11,24,36,0.7) 60%)', border: '1px solid rgba(57,247,42,0.35)', boxShadow: '0 20px 50px rgba(0,0,0,0.4), 0 0 42px rgba(57,247,42,0.14)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.55)', marginBottom: 14 }}>
                      Total Revenue · Confirmed
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(44px, 6vw, 72px)', lineHeight: 1, color: ACCENT, textShadow: '0 0 34px rgba(57,247,42,0.4)' }}>
                      ₹{totalRevenue.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', color: ACCENT, border: '1px solid rgba(57,247,42,0.35)', borderRadius: 999, padding: '8px 14px', background: 'rgba(57,247,42,0.08)', marginBottom: 10 }}>
                      <span style={{ fontSize: 13 }}>↑</span> +18% this month
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.1em', color: 'rgba(245,245,245,0.4)' }}>
                      Hourly ₹{revenue.toLocaleString()} · Extended ₹{extendedRevenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity feeds */}
              <div className="resp-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="admin-card admin-row-in" style={{ padding: '22px 16px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px 16px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#F5F5F5' }}>
                      Recent Hourly Bookings
                    </div>
                    <span className="admin-chip" style={{ color: ACCENT, background: 'rgba(57,247,42,0.08)', borderColor: 'rgba(57,247,42,0.3)' }}>
                      {HOURLY.length} total
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {HOURLY.slice(0, 4).map(b => renderFeedRow(b.customer, `${b.date} · ${b.start} – ${b.end} · ${b.duration}H`, b.status, b.id))}
                  </div>
                </div>
                <div className="admin-card admin-row-in" style={{ padding: '22px 16px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px 16px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#F5F5F5' }}>
                      Recent Extended Bookings
                    </div>
                    <span className="admin-chip" style={{ color: ACCENT, background: 'rgba(57,247,42,0.08)', borderColor: 'rgba(57,247,42,0.3)' }}>
                      {ALL_EXTENDED.length} total
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {ALL_EXTENDED.slice(0, 4).map(b => renderFeedRow(b.customer, `${b.startDate} → ${b.endDate} · ${b.startTime}`, b.status, b.id))}
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {/* Hourly bookings */}
          {section === 'hourly' ? (
            <>
              <SectionHeader eyebrow="Bookings · Hourly" title="Hourly bookings." />
              <div className="admin-card admin-row-in" style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.55)' }}>
                    All Hourly Bookings
                  </div>
                  <span className="admin-chip" style={{ color: ACCENT, background: 'rgba(57,247,42,0.08)', borderColor: 'rgba(57,247,42,0.3)' }}>
                    {HOURLY.length} records
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
                  {HOURLY.map((b, i) => (
                    <div
                      key={b.id}
                      style={{
                        width: 140,
                        height: 140,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(11,24,36,0.8), rgba(11,24,36,0.5))',
                        border: '1px solid rgba(57,247,42,0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        boxShadow: '0 0 20px rgba(57,247,42,0.1)',
                        animation: `booking-orbit 12s linear infinite`,
                        animationDelay: `${i * 0.5}s`,
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.08)'
                        e.currentTarget.style.boxShadow = '0 0 30px rgba(57,247,42,0.3)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(57,247,42,0.1)'
                      }}
                    >
                      <Avatar name={b.customer} size={36} />
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: ACCENT, textAlign: 'center', lineHeight: 1.3 }}>
                        {b.date}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(245,245,245,0.5)', textAlign: 'center' }}>
                        {b.start} - {b.end}
                      </div>
                      <StatusChip status={b.status} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {/* Extended bookings */}
          {section === 'extended' ? (
            <>
              <SectionHeader eyebrow="Bookings · Extended" title="Extended bookings." />
              <div className="admin-card admin-row-in" style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.55)' }}>
                    Arena Reservation Requests
                  </div>
                  <span className="admin-chip" style={{ color: ACCENT, background: 'rgba(57,247,42,0.08)', borderColor: 'rgba(57,247,42,0.3)' }}>
                    {ALL_EXTENDED.length} records
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
                  {ALL_EXTENDED.map((b, i) => (
                    <div
                      key={b.id}
                      style={{
                        width: 150,
                        height: 150,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(11,24,36,0.8), rgba(11,24,36,0.5))',
                        border: '1px solid rgba(59,130,246,0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        boxShadow: '0 0 20px rgba(59,130,246,0.1)',
                        animation: `booking-orbit 14s linear infinite`,
                        animationDelay: `${i * 0.6}s`,
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.08)'
                        e.currentTarget.style.boxShadow = '0 0 30px rgba(59,130,246,0.3)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(59,130,246,0.1)'
                      }}
                    >
                      <Avatar name={b.customer} size={36} />
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#3B82F6', textAlign: 'center', lineHeight: 1.3 }}>
                        {b.players} Players
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(245,245,245,0.5)', textAlign: 'center' }}>
                        {b.startDate}
                      </div>
                      <StatusChip status={b.status} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          {/* Customers */}
          {section === 'customers' ? (
            <>
              <SectionHeader eyebrow="Directory" title="Customers." />
              <div className="admin-card admin-row-in" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px', borderBottom: '1px solid rgba(160,168,184,0.12)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.55)' }}>
                    Customer Directory
                  </div>
                  <span className="admin-chip" style={{ color: ACCENT, background: 'rgba(57,247,42,0.08)', borderColor: 'rgba(57,247,42,0.3)' }}>
                    {CUSTOMERS.length} customers
                  </span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={tableStyles}>
                    <thead>
                      <tr>
                        <th style={thStyle}>#</th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Mobile Number</th>
                        <th style={thStyle}>Bookings</th>
                        <th style={thStyle}>Total Spent</th>
                        <th style={thStyle}>Last Booking</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CUSTOMERS.map((c, i) => (
                        <tr key={c.phone} style={{ transition: 'background 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(57,247,42,0.05)' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                          <td style={{ ...tdStyle, ...mono, color: 'rgba(245,245,245,0.35)' }}>{String(i + 1).padStart(2, '0')}</td>
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <Avatar name={c.name} size={30} />
                              {c.name}
                            </div>
                          </td>
                          <td style={{ ...tdStyle, ...mono, color: ACCENT }}>{c.phone}</td>
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

          {/* Settings */}
          {section === 'settings' ? (
            <>
              <SectionHeader eyebrow="Admin · Settings" title="Settings." />
              <div className="resp-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Download Customers List */}
                <div className="admin-card admin-row-in" style={{ padding: '28px 26px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#F5F5F5', marginBottom: 6 }}>
                        Download Customers List
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(245,245,245,0.5)' }}>
                        Export all customer data as CSV
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '20px 16px', background: 'rgba(59,130,246,0.06)', borderRadius: 10, border: '1px solid rgba(59,130,246,0.2)', marginBottom: 20 }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(245,245,245,0.5)', textAlign: 'center' }}>
                      {CUSTOMERS.length} customers available for export
                    </div>
                  </div>

                  <button
                    style={{
                      width: '100%', padding: '12px 16px', background: 'linear-gradient(135deg, #3B82F6, #60A5FA)', border: 'none',
                      borderRadius: 10, color: '#FFFFFF', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                      textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 10px 26px rgba(59,130,246,0.35)', transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 34px rgba(59,130,246,0.5)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 26px rgba(59,130,246,0.35)' }}
                  >
                    ↓ Download CSV
                  </button>
                </div>

                {/* Block Online Bookings */}
                <div className="admin-card admin-row-in" style={{ padding: '28px 26px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#F5F5F5', marginBottom: 6 }}>
                        Block Online Bookings
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(245,245,245,0.5)' }}>
                        Prevent customers from booking online
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '20px 16px', background: 'rgba(255,107,107,0.06)', borderRadius: 10, border: '1px solid rgba(255,107,107,0.2)', marginBottom: 20 }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(245,245,245,0.5)', textAlign: 'center' }}>
                      Online bookings are currently enabled
                    </div>
                  </div>

                  <button
                    style={{
                      width: '100%', padding: '12px 16px', background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.4)',
                      borderRadius: 10, color: '#FF6B6B', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                      textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.25)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.15)' }}
                  >
                    ✕ Block Bookings
                  </button>
                </div>

                {/* Change ID Password */}
                <div className="admin-card admin-row-in" style={{ padding: '28px 26px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#F5F5F5', marginBottom: 6 }}>
                        Change ID Password
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(245,245,245,0.5)' }}>
                        Update your admin credentials
                      </div>
                    </div>
                  </div>

                  {!showPasswordForm ? (
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      style={{
                        width: '100%', padding: '12px 16px', background: 'rgba(57,247,42,0.1)', border: '1px solid rgba(57,247,42,0.3)',
                        borderRadius: 10, color: ACCENT, fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                        textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(57,247,42,0.15)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(57,247,42,0.1)' }}
                    >
                      Change Password
                    </button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.55)', marginBottom: 6 }}>
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          style={{
                            width: '100%', padding: '10px 12px', background: 'rgba(11,24,36,0.8)', border: '1px solid rgba(160,168,184,0.2)',
                            borderRadius: 8, color: '#F5F5F5', fontFamily: 'var(--font-body)', fontSize: 13, boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.55)', marginBottom: 6 }}>
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          style={{
                            width: '100%', padding: '10px 12px', background: 'rgba(11,24,36,0.8)', border: '1px solid rgba(160,168,184,0.2)',
                            borderRadius: 8, color: '#F5F5F5', fontFamily: 'var(--font-body)', fontSize: 13, boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.55)', marginBottom: 6 }}>
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          style={{
                            width: '100%', padding: '10px 12px', background: 'rgba(11,24,36,0.8)', border: '1px solid rgba(160,168,184,0.2)',
                            borderRadius: 8, color: '#F5F5F5', fontFamily: 'var(--font-body)', fontSize: 13, boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                        <button
                          onClick={() => {
                            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                              alert('Passwords do not match')
                              return
                            }
                            alert('Password changed successfully')
                            setShowPasswordForm(false)
                            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                          }}
                          style={{
                            flex: 1, padding: '10px 16px', background: 'linear-gradient(135deg, #39F72A, #C7F42D)', border: 'none',
                            borderRadius: 8, color: '#000000', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                            textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                          Update Password
                        </button>
                        <button
                          onClick={() => {
                            setShowPasswordForm(false)
                            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                          }}
                          style={{
                            flex: 1, padding: '10px 16px', background: 'rgba(160,168,184,0.1)', border: '1px solid rgba(160,168,184,0.2)',
                            borderRadius: 8, color: 'rgba(245,245,245,0.6)', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                            textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(160,168,184,0.15)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(160,168,184,0.1)' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </main>
      </div>
    </div>
  )
}
