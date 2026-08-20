import { useMemo, useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import type { VerificationState } from '../hooks/useVerification'

const RATE = 700
const ACCENT = '#39FF7A'
const ACCENT_RGB = '57,255,122'
const DURATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const sessionType = (h: number) => {
  if (h >= 6) return { icon: '🏟', label: 'Extended Arena Session' }
  return { icon: '⚡', label: 'Quick Play' }
}

const bookingType = (h: number) => {
  if (h === 8) return 'Team Event'
  return 'Long Session'
}

const EXTRA_FEATURES = ['Tournament Ready', 'Squad & Coach Friendly', 'On-Site Coordination', 'Exclusive Arena Access']

const ExtCell = ({ label, value }: { label: string; value: string }) => (
  <div style={{ background: 'rgba(11,24,36,0.6)', border: '1px solid rgba(160,168,184,0.14)', borderRadius: 8, padding: '10px 12px' }}>
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.4)', marginBottom: 4 }}>
      {label}
    </div>
    <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: ACCENT }}>
      {value}
    </div>
  </div>
)

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const seeded = (key: string) => {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const isAvailable = (d: Date, hour: number) => {
  const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  return (seeded(key) + hour * 7 + d.getDay() * 3) % 10 > 2
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const isSlotAvailable = (d: Date, hour: number) => {
  if (!isAvailable(d, hour)) return false
  const now = new Date()
  if (sameDay(d, now) && hour <= now.getHours()) return false
  return true
}

const firstAvailable = (d: Date): number | null => {
  for (let h = 0; h < 24; h++) {
    if (isSlotAvailable(d, h)) return h
  }
  return null
}

const fmtHour = (h: number) => {
  const hh = h % 12 === 0 ? 12 : h % 12
  return `${String(hh).padStart(2, '0')}:00 ${h < 12 ? 'AM' : 'PM'}`
}

const fmtDateLong = (d: Date) => `${DAY_SHORT[d.getDay()]}, ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`

function CricketBallIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" style={{ color: ACCENT, flexShrink: 0 }}>
      <circle cx="12" cy="12" r="9" />
      <path d="M6.8 15.6c3 3.2 7.4 3 10.4-.2" strokeLinecap="round" />
      <path d="M17.2 8.4c-3-3.2-7.4-3-10.4.2" strokeLinecap="round" />
    </svg>
  )
}

function CalendarIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: ACCENT, flexShrink: 0 }}>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M3.5 10h17M8 2.8V6.4M16 2.8V6.4" />
    </svg>
  )
}

function ClockIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" style={{ color: ACCENT, flexShrink: 0 }}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BoltIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true" style={{ color: ACCENT, flexShrink: 0 }}>
      <path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12L13 2z" />
    </svg>
  )
}

function TapIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: ACCENT, flexShrink: 0 }}>
      <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M12 10.5V4a1.5 1.5 0 0 1 3 0v6.5" />
      <path d="M15 9V5.5a1.5 1.5 0 0 1 3 0V14" />
      <path d="M18 14v3a6 6 0 0 1-12 0v-2a3 3 0 0 1 6 0" />
    </svg>
  )
}

const FEATURES = [
  { title: '24/7 Turf Access', icon: <ClockIcon /> },
  { title: 'Instant Booking', icon: <BoltIcon /> },
  { title: 'Football & Cricket', icon: <CricketBallIcon /> },
  { title: 'Easy Online Booking', icon: <TapIcon /> },
]

export default function Pricing({ verification, onReserveArena }: { verification: VerificationState; onReserveArena: () => void }) {
  const ref = useReveal<HTMLDivElement>('in', 0.1)
  const refNum = useRef(Math.floor(1000 + Math.random() * 9000))
  const bookingRef = useRef<HTMLDivElement>(null)
  const verifyRef = useRef<HTMLDivElement>(null)
  const {
    verified,
    step,
    name,
    mobile,
    otp,
    error,
    otpRefs,
    setName,
    setMobile,
    handleSendOtp,
    handleOtpChange,
    handleOtpPaste,
    handleVerifyOtp,
    editNumber,
  } = verification
  const [date, setDate] = useState(() => new Date())
  const [time, setTime] = useState<number | null>(() => firstAvailable(new Date()))
  const [hours, setHours] = useState(1)
  const [confirmed, setConfirmed] = useState(false)

  const smoothScrollTo = (el: HTMLElement | null) => {
    if (!el) return
    const targetY = el.getBoundingClientRect().top + window.scrollY - 84
    const startY = window.scrollY
    const diff = targetY - startY
    const duration = 800
    const start = performance.now()
    const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      window.scrollTo(0, startY + diff * easeInOut(p))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  const dateOptions = useMemo(() => {
    const out: { date: Date; label: string }[] = []
    const now = new Date()
    for (let i = 0; i < 45; i++) {
      const d = new Date(now)
      d.setDate(now.getDate() + i)
      const label =
        i === 0
          ? `Today · ${fmtDateLong(d)}`
          : i === 1
            ? `Tomorrow · ${fmtDateLong(d)}`
            : fmtDateLong(d)
      out.push({ date: d, label })
    }
    return out
  }, [])

  const total = RATE * hours
  const durationLabel = `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`
  const endHour = time !== null ? (time + hours) % 24 : null
  const crossesDay = time !== null && time + hours >= 24
  const session = sessionType(hours)
  const canBook = time !== null

  const changeDate = (i: number) => {
    const d = dateOptions[i].date
    setDate(d)
    setTime(t => (t !== null && isSlotAvailable(d, t) ? t : firstAvailable(d)))
    setConfirmed(false)
  }

  const inBlock = (h: number) =>
    time !== null && hours > 1 && h >= time && h <= Math.min(time + hours - 1, 23) && h !== time && isSlotAvailable(date, h)

  const SummaryRow = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(160,168,184,0.12)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.4)' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: accent ? ACCENT : '#F2F4F2', textAlign: 'right' }}>
        {value}
      </span>
    </div>
  )

  return (
    <section id="pricing" className="booking-section" style={{ background: 'rgba(11,24,36,0.55)', padding: '80px 32px' }}>
      <span id="booking" style={{ position: 'absolute', top: 0 }} />
      <div className="pitch-lines" />
      <div className="cricket-pitch" />
      <div className="stadium-light" />

      <div ref={ref} className="reveal container" style={{ margin: '0 auto' }}>
        {/* Highlight / CTA */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(48px, 7vw, 88px)', textTransform: 'uppercase', lineHeight: 0.95, margin: 0, color: '#F2F4F2' }}>
            Best <span style={{ color: ACCENT }}>price.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 16, color: '#A0A8B8', maxWidth: 540, margin: '18px auto 0', lineHeight: 1.7 }}>
            Reserve your turf in seconds. Open 24/7 for football and cricket.
          </p>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8, margin: '28px 0 32px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(60px, 8vw, 104px)', color: ACCENT, lineHeight: 1, textShadow: '0 0 40px rgba(57,255,122,0.35)' }}>
              ₹700
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, letterSpacing: '0.22em', color: 'rgba(245,245,245,0.55)' }}>
              / HOUR
            </span>
          </div>

          <div className="feature-grid" style={{ maxWidth: 900, margin: '0 auto' }}>
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#F2F4F2' }}>
                  {f.title}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 36 }}>
            <button className="cta-btn" onClick={() => smoothScrollTo(verified ? bookingRef.current : verifyRef.current)}>
              Reserve Your Slot
            </button>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.35)', marginTop: 16 }}>
              Premium Turf Experience · Book Anytime · Play Anytime
            </div>
          </div>
        </div>

        {/* Player Verification */}
        <div ref={verifyRef} style={{ maxWidth: 620, margin: '0 auto 48px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, border: '1px solid rgba(57,255,122,0.35)', borderRadius: 999, padding: '6px 14px', marginBottom: 16, background: 'rgba(57,255,122,0.06)' }}>
            <span className="hm-live-dot" style={{ width: 6, height: 6 }} />
            Quick · Secure · Reliable
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px, 4.5vw, 54px)', textTransform: 'uppercase', color: '#F2F4F2', margin: 0 }}>
            Verify your <span style={{ color: ACCENT }}>access.</span>
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#A0A8B8', maxWidth: 460, margin: '14px auto 28px', lineHeight: 1.7 }}>
            Complete a quick verification to unlock live slot booking and receive instant booking updates.
          </p>

          <div className="verify-card">
            {!verified && step === 'form' ? (
              <>
                <div style={{ marginBottom: 18 }}>
                  <div className="verify-field">Full Name</div>
                  <input className="verify-input" placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} maxLength={60} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div className="verify-field">Mobile Number</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0 14px', background: 'rgba(11,24,36,0.6)', border: '1px solid rgba(160,168,184,0.25)', borderRadius: 10, fontFamily: 'var(--font-mono)', fontSize: 13, color: '#A0A8B8' }}>
                      +91
                    </div>
                    <input
                      className="verify-input"
                      style={{ flex: 1 }}
                      placeholder="Enter mobile number"
                      inputMode="numeric"
                      maxLength={10}
                      value={mobile}
                      onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      onKeyDown={e => { if (e.key === 'Enter') handleSendOtp() }}
                    />
                  </div>
                </div>
                {error ? <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: '#FF6B6B', textAlign: 'center', marginBottom: 14 }}>{error}</div> : null}
                <button className="verify-btn" onClick={handleSendOtp}>Send OTP</button>
              </>
            ) : !verified && step === 'otp' ? (
              <>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#A0A8B8', textAlign: 'center', lineHeight: 1.7, marginBottom: 16 }}>
                  Enter the 6-digit code sent to <span style={{ color: '#F2F4F2', fontFamily: 'var(--font-mono)' }}>+91 {mobile}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.4)', textAlign: 'center', marginBottom: 12 }}>
                  Enter Verification Code
                </div>
                <div className="otp-boxes">
                  {Array.from({ length: 6 }, (_, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el }}
                      className="otp-box"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={otp[i]}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Backspace' && !otp[i] && i > 0) {
                          otpRefs.current[i - 1]?.focus()
                        }
                      }}
                      onPaste={handleOtpPaste}
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.3)', textAlign: 'center', marginTop: 12 }}>
                  Demo OTP: 123456
                </div>
                {error ? <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: '#FF6B6B', textAlign: 'center', marginTop: 10 }}>{error}</div> : null}
                <button className="verify-btn" onClick={handleVerifyOtp} style={{ marginTop: 18 }}>
                  Verify &amp; Continue
                </button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', color: 'rgba(245,245,245,0.5)' }}>
                  Didn't receive it?
                  <button
                    onClick={editNumber}
                    style={{ background: 'none', border: 'none', color: ACCENT, fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit', cursor: 'pointer', textTransform: 'uppercase', padding: 0 }}
                  >
                    Edit number
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="success-ring">
                  <span>✓</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 8 }}>
                  ✓ Mobile Verified
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 30, textTransform: 'uppercase', color: '#F2F4F2', textAlign: 'center', marginBottom: 6 }}>
                  Welcome, {name.trim() ? name.trim().split(' ')[0] : 'Player'}.
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#A0A8B8', textAlign: 'center', lineHeight: 1.7, marginBottom: 24 }}>
                  Your access is unlocked. Pick your date and time to book your slot.
                </div>
                <button className="verify-btn" onClick={() => smoothScrollTo(bookingRef.current)}>
                  Continue To Slot Booking
                </button>
              </>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 18, flexWrap: 'wrap', marginTop: 22, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.45)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ color: ACCENT }}>✓</span> Secure Mobile Verification</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ color: ACCENT }}>✓</span> Faster Future Bookings</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ color: ACCENT }}>✓</span> Booking Confirmation Alerts</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ color: ACCENT }}>✓</span> Access Booking History</span>
          </div>
        </div>

        {/* Access Level */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(30px, 4vw, 48px)', textTransform: 'uppercase', color: '#F2F4F2', margin: 0 }}>
              Select your <span style={{ color: ACCENT }}>access level.</span>
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#A0A8B8', margin: '12px 0 0', lineHeight: 1.7 }}>
              Choose how you want to use the arena.
            </p>
          </div>
          <div className="access-grid">
            <div className="access-card access-card-hourly">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: ACCENT, border: '1px solid rgba(57,255,122,0.35)', borderRadius: 999, padding: '4px 12px', marginBottom: 18, background: 'rgba(57,255,122,0.06)' }}>
                Casual Play
              </div>
              <div style={{ fontSize: 34, marginBottom: 10 }}>⚽</div>
              <div className="access-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#F2F4F2', marginBottom: 6 }}>
                Player Access
              </div>
              <div className="access-sub" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#A0A8B8', lineHeight: 1.7, marginBottom: 20 }}>
                For casual games and quick matches.
              </div>
              <ul className="access-bullets">
                <li>No Extra Charge</li>
                <li>No Membership Required</li>
                <li>Flexible Time Selection</li>
                <li>Perfect For Friends &amp; Small Teams</li>
                <li>Pay Only For Time Used</li>
              </ul>
              <button className="verify-btn" onClick={() => smoothScrollTo(bookingRef.current)}>
                Book By Hour →
              </button>
            </div>
            <div className="access-card access-card-extended">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: ACCENT, border: '1px solid rgba(57,255,122,0.35)', borderRadius: 999, padding: '4px 12px', marginBottom: 18, background: 'rgba(57,255,122,0.06)' }}>
                Exclusive Events
              </div>
              <div style={{ fontSize: 34, marginBottom: 10 }}>🏟</div>
              <div className="access-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#F2F4F2', marginBottom: 6 }}>
                Arena Access
              </div>
              <div className="access-sub" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#A0A8B8', lineHeight: 1.7, marginBottom: 20 }}>
                For events, tournaments, and exclusive turf usage.
              </div>
              <ul className="access-bullets">
                <li>Exclusive Turf Reservation</li>
                <li>Multi-Hour &amp; Full-Day Access</li>
                <li>Tournament &amp; Event Friendly</li>
                <li>Team Training Sessions</li>
                <li>Overnight Booking Available</li>
              </ul>
              <button
                className="verify-btn"
                onClick={() => {
                  if (!verified) {
                    smoothScrollTo(verifyRef.current)
                    return
                  }
                  onReserveArena()
                  requestAnimationFrame(() => {
                    requestAnimationFrame(() => smoothScrollTo(document.getElementById('extended-booking')))
                  })
                }}
              >
                Reserve The Arena →
              </button>
            </div>
          </div>
        </div>

        {/* Left: slots panel · Right: summary */}
        <div style={{ position: 'relative' }}>
          {!verified ? (
            <div style={{ position: 'absolute', inset: 0, zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, pointerEvents: 'none' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(11,24,36,0.9)', border: '1px solid rgba(57,255,122,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(57,255,122,0.3)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#39FF7A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.5" />
                  <path d="M8 10.5V7.5a4 4 0 018 0v3" />
                </svg>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.6)' }}>
                Verify your access to unlock slots
              </div>
            </div>
          ) : null}
          <div ref={bookingRef} id="slot-booking" className={'resp-two-col booking-grid' + (verified ? '' : ' locked')} style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 28, alignItems: 'start', scrollMarginTop: 84 }}>
          <div className="glass-card" style={{ padding: '28px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 30, textTransform: 'uppercase', letterSpacing: '0.02em', color: '#F2F4F2', margin: 0 }}>
                Choose your <span style={{ color: ACCENT }}>slot.</span>
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="hm-live-dot" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: ACCENT }}>LIVE</span>
              </div>
            </div>
            <div className="date-field" style={{ marginBottom: 14, maxWidth: 380 }}>
              <select
                value={dateOptions.findIndex(o => sameDay(o.date, date))}
                onChange={e => changeDate(Number(e.target.value))}
                aria-label="Select booking date"
              >
                {dateOptions.map((o, i) => (
                  <option key={i} value={i}>{o.label}</option>
                ))}
              </select>
              <span className="date-chevron">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', color: 'rgba(245,245,245,0.45)', marginBottom: 16 }}>
              <CalendarIcon />
              {fmtDateLong(date)}
            </div>

            <div className="ts-grid">
              {Array.from({ length: 24 }, (_, h) => {
                const avail = isSlotAvailable(date, h)
                const sel = time === h
                const block = !sel && inBlock(h)
                return (
                  <button
                    key={h}
                    className={'ts-slot ' + (sel ? 'ts-selected' : block ? 'ts-block' : avail ? 'ts-avail' : 'ts-booked')}
                    disabled={!avail}
                    onClick={() => { setTime(h); setConfirmed(false) }}
                    aria-label={`${fmtHour(h)} ${avail ? 'available' : 'booked'}`}
                  >
                    {fmtHour(h)}
                  </button>
                )
              })}
            </div>

            <div className="hm-legend" style={{ marginTop: 18 }}>
              <div className="hm-legend-item">
                <span className="hm-legend-swatch" style={{ background: ACCENT, boxShadow: `0 0 8px rgba(${ACCENT_RGB},0.7)` }} />
                Available
              </div>
              <div className="hm-legend-item">
                <span className="hm-legend-swatch" style={{ background: '#1B2A38' }} />
                Booked
              </div>
              <div className="hm-legend-item">
                <span className="hm-legend-swatch" style={{ background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#030607', fontSize: 9, fontWeight: 700 }}>✓</span>
                Selected
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', margin: '24px 0 12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.45)' }}>
                Extend Your Session
              </div>
              {hours < 6 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT, background: `rgba(${ACCENT_RGB},0.1)`, border: `1px solid rgba(${ACCENT_RGB},0.4)`, borderRadius: 999, padding: '5px 12px', boxShadow: `0 0 14px rgba(${ACCENT_RGB},0.2)` }}>
                  <span style={{ fontSize: 12 }}>{session.icon}</span>
                  {session.label}
                </div>
              ) : null}
            </div>
            <div className="duration-grid">
              {DURATIONS.map(h => (
                <button
                  key={h}
                  onClick={() => { setHours(h); setConfirmed(false) }}
                  className={'dur-chip' + (hours === h ? ' dur-active' : '')}
                  aria-pressed={hours === h}
                >
                  {h}H
                </button>
              ))}
            </div>
            {hours < 6 ? (
              <div style={{ marginTop: 14, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', color: time !== null ? '#F2F4F2' : 'rgba(245,245,245,0.35)' }}>
                {time !== null && endHour !== null ? (
                  <>
                    <span style={{ color: ACCENT }}>{fmtHour(time)}</span>
                    <span style={{ margin: '0 8px', color: 'rgba(245,245,245,0.35)' }}>→</span>
                    <span style={{ color: ACCENT }}>{fmtHour(endHour)}</span>
                    {crossesDay ? <span style={{ marginLeft: 8, color: 'rgba(245,245,245,0.45)' }}>· next day</span> : null}
                  </>
                ) : (
                  'Select a start time to preview your session'
                )}
              </div>
            ) : (
              <div className={'ext-wrap' + (hours >= 6 ? ' open' : '')}>
                <div>
                  <div className="ext-panel">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: ACCENT }}>
                        🏟 Extended Booking Active
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.55)', background: 'rgba(11,24,36,0.6)', border: '1px solid rgba(160,168,184,0.18)', borderRadius: 999, padding: '5px 11px' }}>
                        {bookingType(hours)}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 10, marginBottom: 14 }}>
                      <ExtCell label="Start Time" value={time !== null ? fmtHour(time) : '—'} />
                      <ExtCell label="End Time" value={time !== null && endHour !== null ? `${fmtHour(endHour)}${crossesDay ? ' · next day' : ''}` : '—'} />
                      <ExtCell label="Selected Duration" value={durationLabel} />
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {EXTRA_FEATURES.map(b => (
                        <span key={b} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.8)', background: `rgba(${ACCENT_RGB},0.08)`, border: `1px solid rgba(${ACCENT_RGB},0.3)`, borderRadius: 999, padding: '5px 10px' }}>
                          <span style={{ color: ACCENT }}>✓</span>
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <aside className="glass-card summary-card" style={{ padding: '28px 24px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 4 }}>
              Booking Summary
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 32, textTransform: 'uppercase', letterSpacing: '0.02em', color: '#F2F4F2', marginBottom: 18 }}>
              Review your booking.
            </div>

            {confirmed ? (
              <div style={{ textAlign: 'center', paddingTop: 8 }}>
                <div className="confirm-check">
                  <svg viewBox="0 0 52 52" width="78" height="78" className="confirm-svg">
                    <circle className="confirm-circle" cx="26" cy="26" r="24" />
                    <path className="confirm-tick" d="M14 27l8 8 16-17" />
                  </svg>
                  <span className="confirm-glow" />
                </div>
                <div className="fade-up" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: ACCENT, textTransform: 'uppercase', marginBottom: 10, animationDelay: '0.6s' }}>
                  Slot Booking Confirmed
                </div>
                <div className="fade-up" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 40, textTransform: 'uppercase', lineHeight: 0.95, color: '#F2F4F2', marginBottom: 14, animationDelay: '0.75s' }}>
                  See you<br />on the turf.
                </div>
                <p className="fade-up" style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#A0A8B8', lineHeight: 1.7, marginBottom: 16, animationDelay: '0.9s' }}>
                  {fmtDateLong(date)} · {time !== null ? fmtHour(time) : ''}{time !== null && endHour !== null ? ` → ${fmtHour(endHour)}${crossesDay ? ' · next day' : ''}` : ''} · {durationLabel}
                </p>
                <div className="fade-up" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 38, color: ACCENT, marginBottom: 8, animationDelay: '1.05s' }}>
                  ₹{total.toLocaleString()}
                </div>
                <div className="fade-up" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', color: 'rgba(245,245,245,0.35)', textTransform: 'uppercase', marginBottom: 24, animationDelay: '1.2s' }}>
                  Reference · TF24-{refNum.current}
                </div>
                <button
                  onClick={() => setConfirmed(false)}
                  style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', background: 'transparent', color: '#A0A8B8', border: '1px solid rgba(160,168,184,0.4)', borderRadius: 8, padding: '13px 24px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.25s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = '#F2F4F2' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(160,168,184,0.4)'; e.currentTarget.style.color = '#A0A8B8' }}
                >
                  Adjust Booking
                </button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 6 }}>
                  <SummaryRow label="Selected Date" value={fmtDateLong(date)} />
                  <SummaryRow label="Start Time" value={time !== null ? fmtHour(time) : 'Select a slot'} accent={time === null} />
                  <SummaryRow label="End Time" value={time !== null && endHour !== null ? `${fmtHour(endHour)}${crossesDay ? ' · next day' : ''}` : '—'} accent={time === null} />
                  <SummaryRow label="Duration" value={durationLabel} />
                </div>

                <div style={{ padding: '18px 0 20px', borderTop: '1px solid rgba(160,168,184,0.18)', borderBottom: '1px solid rgba(160,168,184,0.18)', marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.45)' }}>
                      Total Amount
                    </span>
                    <span key={total} className="fade-up" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 34, color: ACCENT, lineHeight: 1 }}>
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 20 }}>
                  {['Live Availability Check', 'Real-Time Price Calculation', 'Flexible Duration Selection', 'Instant Confirmation'].map(b => (
                    <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.75)' }}>
                      <span style={{ color: ACCENT, flexShrink: 0 }}>✓</span>
                      {b}
                    </div>
                  ))}
                </div>

                <button
                  disabled={!canBook}
                  onClick={() => setConfirmed(true)}
                  style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '15px 24px', fontWeight: 700, border: 'none', borderRadius: 8, cursor: canBook ? 'pointer' : 'not-allowed', transition: 'all 0.25s ease', background: canBook ? ACCENT : 'rgba(160,168,184,0.15)', color: canBook ? '#030607' : 'rgba(245,245,245,0.35)', boxShadow: canBook ? `0 12px 30px rgba(${ACCENT_RGB},0.35)` : 'none' }}
                  onMouseEnter={e => { if (canBook) { e.currentTarget.style.background = '#39FF7A'; e.currentTarget.style.boxShadow = `0 14px 36px rgba(${ACCENT_RGB},0.5)`; e.currentTarget.style.transform = 'translateY(-2px)' } }}
                  onMouseLeave={e => { if (canBook) { e.currentTarget.style.background = ACCENT; e.currentTarget.style.boxShadow = `0 12px 30px rgba(${ACCENT_RGB},0.35)`; e.currentTarget.style.transform = 'translateY(0)' } }}
                >
                  Book Now
                </button>
                <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.28)', marginTop: 12 }}>
                  Secured booking · Manage in your account
                </div>
              </>
            )}
          </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
