import { type ReactNode, useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'

const ACCENT = '#39F72A'
const ACCENT_RGB = '57,247,42'

const EXTRA_OPTIONS = ['Floodlights Required', 'Tournament Setup', 'Equipment Assistance']

const toISO = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const fmtDateLabel = (iso: string) => {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

const defaultEnd = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return toISO(d)
}

const defaultTime = () => {
  const d = new Date()
  d.setHours(d.getHours() + 1)
  return d.toTimeString().slice(0, 5)
}

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div>
    <div className="verify-field">{label}</div>
    {children}
  </div>
)

export default function ExtendedBooking({ verified, onCloseArena }: { verified: boolean; onCloseArena: () => void }) {
  const ref = useReveal<HTMLDivElement>('in', 0.1)
  const refNum = useRef(`AR-${Math.floor(1000 + Math.random() * 9000)}`)
  const [fullName, setFullName] = useState('')
  const [mobileNum, setMobileNum] = useState('')
  const [startDate, setStartDate] = useState(toISO(new Date()))
  const [startTime, setStartTime] = useState(defaultTime())
  const [endDate, setEndDate] = useState(defaultEnd())
  const [endTime, setEndTime] = useState(defaultTime())
  const [requirements, setRequirements] = useState('')
  const [extras, setExtras] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const mobileDigits = mobileNum.replace(/\D/g, '')
  const canSubmit = verified && fullName.trim() !== '' && mobileDigits.length === 10 && startDate !== '' && endDate !== ''

  const toggleExtra = (opt: string) =>
    setExtras(prev => (prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]))

  return (
    <section id="extended-booking" className="booking-section" style={{ background: 'rgba(11,24,36,0.55)', padding: '80px 32px' }}>
      <div className="pitch-lines" />
      <div className="stadium-light" />

      <div ref={ref} className="reveal container" style={{ margin: '0 auto' }}>
        {/* Back to hourly booking */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button
            onClick={() => {
              onCloseArena()
              requestAnimationFrame(() => {
                document.getElementById('slot-booking')?.scrollIntoView({ behavior: 'smooth' })
              })
            }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'transparent', color: '#A0A8B8', border: '1px solid rgba(160,168,184,0.4)', borderRadius: 8, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.25s ease' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = '#F5F5F5' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(160,168,184,0.4)'; e.currentTarget.style.color = '#A0A8B8' }}
          >
            ← Back to Hourly Booking
          </button>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, border: '1px solid rgba(57,247,42,0.35)', borderRadius: 999, padding: '6px 14px', marginBottom: 16, background: 'rgba(57,247,42,0.06)' }}>
            <span className="hm-live-dot" style={{ width: 6, height: 6 }} />
            Premium Arena Reservation
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(38px, 5.5vw, 66px)', textTransform: 'uppercase', lineHeight: 0.95, margin: 0, color: '#F5F5F5' }}>
            Extended <span style={{ color: ACCENT }}>reservation.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#A0A8B8', maxWidth: 580, margin: '16px auto 0', lineHeight: 1.7 }}>
            For tournaments, events, overnight sessions, and long-duration bookings.
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          {!verified ? (
            <div style={{ position: 'absolute', inset: 0, zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, pointerEvents: 'none' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(11,24,36,0.9)', border: '1px solid rgba(57,247,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(57,247,42,0.3)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#39F72A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.5" />
                  <path d="M8 10.5V7.5a4 4 0 018 0v3" />
                </svg>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.6)' }}>
                Verify your access to reserve the arena
              </div>
            </div>
          ) : null}
          <div className={'booking-grid' + (verified ? '' : ' locked')} style={{ maxWidth: 840, margin: '0 auto' }}>
            <div className="glass-card" style={{ padding: '28px 24px' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', paddingTop: 8 }}>
                  <div className="success-ring">
                    <span>✓</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'rgba(245,245,245,0.4)', textTransform: 'uppercase', marginBottom: 10 }}>
                    Request Received
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 40, textTransform: 'uppercase', lineHeight: 0.95, color: '#F5F5F5', marginBottom: 14 }}>
                    Arena<br />on hold.
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#A0A8B8', lineHeight: 1.7, marginBottom: 16 }}>
                    {fmtDateLabel(startDate)} · {startTime || '—'} to {fmtDateLabel(endDate)} · {endTime || '—'}
                  </p>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em', color: ACCENT, textTransform: 'uppercase', marginBottom: 24 }}>
                    Reference · {refNum.current}
                  </div>
                  <button
                    className="verify-btn"
                    style={{ background: 'transparent', color: '#A0A8B8', border: '1px solid rgba(160,168,184,0.4)', boxShadow: 'none' }}
                    onClick={() => setSubmitted(false)}
                  >
                    Adjust Request
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: ACCENT, marginBottom: 22 }}>
                    Extended Booking Request
                  </div>
                  <div style={{ display: 'grid', gap: 18 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <Field label="Full Name">
                        <input className="verify-input" placeholder="Enter your full name" value={fullName} onChange={e => setFullName(e.target.value)} maxLength={60} />
                      </Field>
                      <Field label="Mobile Number">
                        <input
                          className="verify-input"
                          placeholder="Enter mobile number"
                          inputMode="numeric"
                          maxLength={10}
                          value={mobileNum}
                          onChange={e => setMobileNum(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        />
                      </Field>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <Field label="Start Date">
                        <input type="date" className="verify-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
                      </Field>
                      <Field label="Start Time">
                        <input type="time" className="verify-input" value={startTime} onChange={e => setStartTime(e.target.value)} />
                      </Field>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <Field label="End Date">
                        <input type="date" className="verify-input" value={endDate} onChange={e => setEndDate(e.target.value)} />
                      </Field>
                      <Field label="End Time">
                        <input type="time" className="verify-input" value={endTime} onChange={e => setEndTime(e.target.value)} />
                      </Field>
                    </div>

                    <Field label="Requirements / Special Requests">
                      <textarea
                        className="verify-input"
                        style={{ minHeight: 132, resize: 'vertical', lineHeight: 1.7 }}
                        placeholder="Tell us about your event, team count, special requirements, equipment needs, or tournament details."
                        value={requirements}
                        onChange={e => setRequirements(e.target.value)}
                      />
                    </Field>

                    <Field label="Additional Options">
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {EXTRA_OPTIONS.map(opt => {
                          const active = extras.includes(opt)
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => toggleExtra(opt)}
                              aria-pressed={active}
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: 10,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                padding: '10px 16px',
                                borderRadius: 999,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                background: active ? `rgba(${ACCENT_RGB},0.12)` : 'rgba(11,24,36,0.6)',
                                border: active ? `1px solid rgba(${ACCENT_RGB},0.6)` : '1px solid rgba(160,168,184,0.25)',
                                color: active ? '#F5F5F5' : '#A0A8B8',
                                boxShadow: active ? `0 0 16px rgba(${ACCENT_RGB},0.22)` : 'none',
                              }}
                            >
                              {active ? '✓ ' : '+ '}
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    </Field>

                    <button
                      className="verify-btn"
                      disabled={!canSubmit}
                      onClick={() => setSubmitted(true)}
                      style={{ opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? 'pointer' : 'not-allowed', boxShadow: canSubmit ? `0 10px 30px rgba(${ACCENT_RGB},0.35), 0 0 40px rgba(${ACCENT_RGB},0.25)` : 'none' }}
                    >
                      Request Extended Booking
                    </button>
                    <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.35)', marginTop: 2, lineHeight: 1.8 }}>
                      Our team will contact you shortly to confirm availability and pricing.
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
