import { Fragment, useMemo, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useReveal } from '../hooks/useReveal'
import AnimatedPrice from './AnimatedPrice'
import { seeded, fmtDate } from '../data/tf24'

const TURF_GREEN = '#39FF7A'
const CHROME = '#F2F4F2'
const HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]

const HOURLY_RATE = 700
const RATE_LABEL = `₹${HOURLY_RATE} / HOUR`

const pad = (n: number) => String(n).padStart(2, '0')
const time = (h: number) => {
  const hour12 = h % 12 === 0 ? 12 : h % 12
  const suffix = h < 12 ? 'AM' : 'PM'
  return `${hour12} ${suffix}`
}

const pricingTable: Record<number, { label: string; price: number; rate: string }> = {}
for (const d of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24]) {
  pricingTable[d] = {
    label: d === 1 ? '1 HOUR' : d === 24 ? 'FULL DAY' : `${d} HOURS`,
    price: HOURLY_RATE * d,
    rate: RATE_LABEL,
  }
}

function hashSeed(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(a: number) {
  return function () {
    a |= 0
    a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeQR(payload: string, size = 25) {
  const rand = mulberry32(hashSeed(payload))
  const m: boolean[] = []
  for (let i = 0; i < size * size; i++) m.push(rand() > 0.5)
  const finder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const edge = r === 0 || r === 6 || c === 0 || c === 6
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4
        m[(row + r) * size + (col + c)] = edge || core
      }
    }
  }
  finder(0, 0)
  finder(0, size - 7)
  finder(size - 7, 0)
  return m
}

function QrCode({ payload, color = '#0B0B0B', bg = '#F2F4F2' }: { payload: string; color?: string; bg?: string }) {
  const size = 25
  const module = 8
  const quiet = 3 * module
  const dim = size * module + quiet * 2
  const m = makeQR(payload, size)
  return (
    <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} role="img" aria-label="Payment QR code">
      <rect width={dim} height={dim} fill={bg} />
      {m.map((on, i) => {
        if (!on) return null
        const r = Math.floor(i / size)
        const c = i % size
        return <rect key={i} x={quiet + c * module} y={quiet + r * module} width={module - 0.6} height={module - 0.6} fill={color} />
      })}
    </svg>
  )
}


const PROGRESS_STEPS = ['Select Slot', 'Confirm & Pay', 'Confirmed']

function Progress({ active }: { active: number }) {
  return (
    <div className="tf24-progress">
      {PROGRESS_STEPS.map((s, i) => {
        const n = i + 1
        const isActive = n === active
        return (
          <Fragment key={s}>
            {i > 0 && <span className={'tf24-progress-line' + (n <= active ? ' done' : '')} />}
            <div className={'tf24-progress-step' + (isActive ? ' active' : '')}>
              <span className="tf24-progress-num">0{n}</span>
              <span className="tf24-progress-label">{s}</span>
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}

export default function Booking() {
  const headRef = useReveal<HTMLDivElement>('in', 0.15)
  const schedRef = useReveal<HTMLDivElement>('in', 0.1)
  const sumRef = useReveal<HTMLDivElement>('in', 0.15)

  const [dateIdx, setDateIdx] = useState(0)
  const [start, setStart] = useState<number | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const [end, setEnd] = useState<number | null>(null)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [bookedSlots, setBookedSlots] = useState<Record<string, number[]>>({})

  const dates = useMemo(() => {
    const out: { date: Date; day: string; num: number; label: string }[] = []
    for (let i = 0; i < 6; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      out.push({
        date: d,
        day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        num: d.getDate(),
        label: fmtDate(d),
      })
    }
    return out
  }, [])

  const dateKey = fmtDate(dates[dateIdx].date)

  const isBooked = (h: number) => {
    const alreadyBooked = bookedSlots[dateKey]?.includes(h) ?? false
    return alreadyBooked || seeded(`${dateKey}-${h}`) % 3 === 0
  }

  useEffect(() => {
    if (start !== null && duration !== null) {
      setEnd(start + duration)
    }
  }, [start, duration])

  const handleStartClick = (h: number) => {
    if (isBooked(h)) return
    setStart(h)
    setDuration(null)
    setEnd(null)
  }

  const handleDurationClick = (dur: number) => {
    setDuration(dur)
    const calculatedEnd = start !== null ? start + dur : null
    setEnd(calculatedEnd)
  }

  const selectedRange = start !== null && end !== null

  const inRange = (h: number) =>
    start !== null && ((end === null && h === start) || (end !== null && h >= start && h < end))

  const dur = duration !== null ? duration : 0

  const priceInfo = useMemo(() => {
    if (dur === 0 || dur === undefined) return null
    return pricingTable[dur] || null
  }, [dur])

  const totalPrice = duration !== null ? duration * HOURLY_RATE : 0

  const durationLabels: number[] = Array.from({ length: 12 }, (_, index) => index + 1)

  const openPaymentModal = () => {
    if (start === null || duration === null) return
    // Open the payment popup without changing the page scroll position.
    setPaymentSuccess(false)
    setPaymentOpen(true)
  }

  const handlePaymentSuccess = () => {
    if (start === null || duration === null || paymentSuccess) return

    const slotKey = fmtDate(dates[dateIdx].date)
    setBookedSlots(prev => ({
      ...prev,
      [slotKey]: [...(prev[slotKey] ?? []), start],
    }))

    // Keep the same payment popup open.
    // Do not show a second success box and do not scroll/navigate.
    setPaymentSuccess(true)
  }

  useEffect(() => {
    if (paymentOpen) {
      const previousBodyOverflow = document.body.style.overflow
      const previousHtmlOverflow = document.documentElement.style.overflow

      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = previousBodyOverflow
        document.documentElement.style.overflow = previousHtmlOverflow
      }
    }

    return undefined
  }, [paymentOpen])

  return (
    <section id="booking" style={{ background: 'rgba(11,24,36,0.55)', padding: '96px 0 120px', overflow: 'hidden' }}>
      <div className="tf24-container">
        <AnimatedPrice />
        {/* Header */}
        <div ref={headRef} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 18 }}>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#39FF7A', textShadow: '0 0 14px rgba(57,255,122,0.5)', paddingLeft: '0.45em' }}>
              BOOK YOUR PLAY
            </span>
            <span style={{ width: 64, height: 2, background: '#39FF7A' }} />
          </div>
          <h2 style={{ fontFamily: 'Bebas Neue', fontWeight: 400, fontSize: 'clamp(56px, 8vw, 128px)', textTransform: 'uppercase', lineHeight: 0.88, margin: 0, color: CHROME }}>
            CLAIM YOUR
            <br />
            <span className="tf24-grad-word" style={{ color: '#39FF7A' }}>PITCH.</span>
          </h2>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: 15, lineHeight: 1.7, color: 'rgba(243,243,243,0.75)', maxWidth: 460, margin: '22px auto 0' }}>
            Choose your day, find an open window, and claim the time you want to play.
          </p>
        </div>

        {/* Date selector */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
          <div className="booking-days" style={{ borderTop: '1px solid rgba(243,243,243,0.12)', borderBottom: '1px solid rgba(243,243,243,0.12)', padding: '18px 8px 22px' }}>
            {dates.map((d, i) => {
              const active = dateIdx === i
              return (
                <button
                  key={i}
                  onClick={() => {
                    setDateIdx(i)
                    setStart(null)
                    setDuration(null)
                    setEnd(null)
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    minWidth: 92,
                    padding: '10px 16px 14px',
                    background: active ? `rgba(57,255,122,0.08)` : 'transparent',
                    border: 'none',
                    borderBottom: active ? `2px solid ${TURF_GREEN}` : '2px solid transparent',
                    cursor: 'pointer',
                    fontFamily: 'Space Grotesk',
                    transition: 'background 0.2s ease, border-color 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', color: active ? CHROME : 'rgba(243,243,243,0.4)' }}>
                    {d.day}
                  </span>
                  <span style={{ fontFamily: 'Bebas Neue', fontSize: 34, lineHeight: 1, color: active ? CHROME : 'rgba(243,243,243,0.55)' }}>
                    {d.num}
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: active ? TURF_GREEN : 'transparent' }}>
                    {active && i === 0 ? '● TODAY' : active ? '●' : '·'}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Two-column interface */}
        <div className="booking-grid">
          {/* Schedule */}
          <div ref={schedRef} className="reveal" style={{ background: 'rgba(7,13,22,0.92)', border: '1px solid rgba(243,243,243,0.1)', padding: '28px 28px 18px', position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 520 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 56, height: 56, borderTop: '2px solid rgba(57,255,122,0.6)', borderLeft: '2px solid rgba(57,255,122,0.6)' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 56, height: 56, borderBottom: '2px solid rgba(57,255,122,0.6)', borderRight: '2px solid rgba(57,255,122,0.6)' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: 28, letterSpacing: '0.04em', color: CHROME }}>
                Live <span style={{ color: TURF_GREEN }}>Availability</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: TURF_GREEN, boxShadow: `0 0 10px ${TURF_GREEN}`, animation: 'tf24-pulse 1.8s ease infinite' }} />
                <span style={{ fontFamily: 'Space Grotesk', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.5)', fontWeight: 600 }}>
                  {dates[dateIdx].label}
                </span>
              </div>
            </div>

            <div style={{ marginTop: 16, marginBottom: 18 }}>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#39FF7A', marginBottom: 10 }}>
                SELECT YOUR PLAYING HOUR
              </div>
            </div>

            <div className="tf24-slot-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, flex: 1, alignContent: 'start' }}>
              {Array.from({ length: 24 }, (_, index) => {
                const h = index
                const booked = isBooked(h)
                const selected = start !== null && h === start
                const label = h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`

                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => {
                      if (!booked) setStart(h)
                    }}
                    disabled={booked}
                    style={{
                      position: 'relative',
                      minHeight: 62,
                      borderRadius: 10,
                      border: selected ? `1px solid ${TURF_GREEN}` : booked ? '1px solid rgba(243,243,243,0.1)' : '1px solid rgba(57,255,122,0.55)',
                      background: selected ? TURF_GREEN : booked ? 'repeating-linear-gradient(135deg, rgba(243,243,243,0.06) 0 6px, rgba(243,243,243,0.02) 6px 12px)' : 'rgba(57,255,122,0.06)',
                      color: selected ? '#030607' : booked ? 'rgba(243,243,243,0.22)' : '#39FF7A',
                      fontFamily: 'Space Grotesk',
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      cursor: booked ? 'not-allowed' : 'pointer',
                      boxShadow: selected ? '0 0 18px rgba(57,255,122,0.4)' : booked ? 'none' : 'inset 0 0 0 1px rgba(57,255,122,0.08)',
                      transition: 'all 0.2s ease',
                      padding: '10px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}
                    onMouseEnter={e => {
                      if (!booked && !selected) {
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(0,201,255,0.35)'
                        e.currentTarget.style.borderColor = '#00C9FF'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!booked && !selected) {
                        e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(57,255,122,0.08)'
                        e.currentTarget.style.borderColor = 'rgba(57,255,122,0.55)'
                      }
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span>{label}</span>
                      {booked && <span aria-label="Booked" style={{ fontSize: 12 }}>🔒</span>}
                    </span>
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: 20, marginTop: 18, fontFamily: 'Space Grotesk', fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.45)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, border: '1px solid rgba(57,255,122,0.55)', background: 'rgba(57,255,122,0.06)' }} /> Available
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: TURF_GREEN, boxShadow: '0 0 10px rgba(57,255,122,0.35)' }} /> Selected
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: 'repeating-linear-gradient(135deg, rgba(243,243,243,0.06) 0 6px, rgba(243,243,243,0.02) 6px 12px)', border: '1px solid rgba(243,243,243,0.1)' }} /> Booked
              </span>
            </div>
          </div>

          {/* Summary */}
          <div ref={sumRef} className="reveal" style={{ background: 'rgba(7,13,22,0.92)', border: '1px solid rgba(243,243,243,0.1)', padding: 32, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 56, height: 56, borderTop: '2px solid rgba(57,255,122,0.6)', borderRight: '2px solid rgba(57,255,122,0.6)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: 56, height: 56, borderBottom: '2px solid rgba(57,255,122,0.6)', borderLeft: '2px solid rgba(57,255,122,0.6)' }} />

            <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 600, letterSpacing: '0.32em', textTransform: 'uppercase', color: TURF_GREEN, marginBottom: 24 }}>
              YOUR PLAYING WINDOW
            </div>

            <div key={start === null ? 'empty' : duration === null ? 'start' : 'full'} className="tf24-summary-state">
              {start === null ? (
                <>
                  <div className="tf24-summary-item" style={{ animationDelay: '0.02s' }}>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.45)', textAlign: 'center' }}>
                      Select a slot to continue
                    </div>
                  </div>

                  <div className="tf24-summary-item tf24-empty-zone" style={{ animationDelay: '0.1s' }}>
                    <div className="tf24-empty-slot">
                      <span className="tf24-empty-plus">+</span>
                      <span className="tf24-empty-label">Select a Slot</span>
                    </div>
                    <div className="tf24-empty-help">Choose an available time from the schedule.</div>
                  </div>

                  <div className="tf24-summary-item" style={{ animationDelay: '0.18s' }}>
                    <div className="tf24-empty-rate">{RATE_LABEL}</div>
                  </div>

                  <div className="tf24-summary-item tf24-progress-wrap" style={{ animationDelay: '0.26s' }}>
                    <Progress active={1} />
                  </div>
                </>
              ) : (
                <>
                  <div className="tf24-summary-item" style={{ animationDelay: '0.04s' }}>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.5)', marginBottom: 18 }}>
                      {dates[dateIdx].label}
                    </div>
                  </div>

                  <div className="tf24-summary-item" style={{ animationDelay: '0.1s' }}>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.5)', marginBottom: 10 }}>
                      Selected Time
                    </div>
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: 52, letterSpacing: '0.02em', color: CHROME, lineHeight: 1.1, minHeight: 52 }}>
                      {start !== null ? time(start) : 'Select a slot'}
                    </div>
                  </div>

                  {start !== null && (
                    <div className="tf24-summary-item" style={{ animationDelay: '0.14s' }}>
                      <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.5)', marginBottom: 18, textAlign: 'center' }}>
                        Select Duration
                      </div>

                      <div
                        className="tf24-duration-circle"
                        style={{
                          width: '100%',
                          maxWidth: 250,
                          margin: '0 auto',
                          aspectRatio: '1',
                          borderRadius: '50%',
                          position: 'relative',
                          border: `1px solid rgba(57,255,122,0.24)`,
                          background: 'radial-gradient(circle at center, rgba(57,255,122,0.08), rgba(0,0,0,0.2) 52%, rgba(0,0,0,0.74) 100%)',
                          boxShadow: 'inset 0 0 24px rgba(57,255,122,0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {durationLabels.map(hour => {
                          const selected = duration === hour
                          const angle = ((hour - 3) / 12) * Math.PI * 2
                          const radius = 82
                          const x = Math.cos(angle) * radius
                          const y = Math.sin(angle) * radius

                          return (
                            <button
                              key={hour}
                              type="button"
                              onClick={() => handleDurationClick(hour)}
                              style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                                transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                                width: 38,
                                height: 38,
                                borderRadius: '50%',
                                border: selected ? `1px solid ${TURF_GREEN}` : '1px solid rgba(243,243,243,0.14)',
                                background: selected ? 'rgba(57,255,122,0.18)' : 'rgba(10,16,24,0.7)',
                                color: selected ? TURF_GREEN : 'rgba(243,243,243,0.8)',
                                fontFamily: 'Space Grotesk',
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: '0.06em',
                                cursor: 'pointer',
                                boxShadow: selected ? `0 0 16px rgba(57,255,122,0.5)` : 'none',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={e => {
                                if (!selected) {
                                  e.currentTarget.style.borderColor = '#00C9FF'
                                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0,201,255,0.35)'
                                }
                              }}
                              onMouseLeave={e => {
                                if (!selected) {
                                  e.currentTarget.style.borderColor = 'rgba(243,243,243,0.14)'
                                  e.currentTarget.style.boxShadow = 'none'
                                }
                              }}
                            >
                              {hour}
                            </button>
                          )
                        })}

                        <div
                          style={{
                            position: 'absolute',
                            inset: '26%',
                            borderRadius: '50%',
                            background: 'rgba(7,13,22,0.88)',
                            border: '1px solid rgba(57,255,122,0.16)',
                            boxShadow: 'inset 0 0 18px rgba(57,255,122,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            textAlign: 'center',
                            padding: 8,
                          }}
                        >
                          <span style={{ fontFamily: 'Space Grotesk', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.56)' }}>
                            Duration
                          </span>
                          <span style={{ fontFamily: 'Bebas Neue', fontSize: 30, letterSpacing: '0.05em', color: TURF_GREEN, lineHeight: 1, marginTop: 4 }}>
                            {duration !== null ? `${duration} HRS` : 'SELECT'}
                          </span>
                          <span style={{ fontFamily: 'Space Grotesk', fontSize: 10, letterSpacing: '0.08em', color: 'rgba(243,243,243,0.7)', marginTop: 4 }}>
                            {duration !== null ? `₹${duration * HOURLY_RATE}` : '₹---'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="tf24-summary-item" style={{ animationDelay: '0.18s' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 18, borderBottom: '1px solid rgba(243,243,243,0.1)', marginBottom: 18 }}>
                      <span style={{ fontFamily: 'Space Grotesk', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.45)' }}>
                        Total Price
                      </span>
                      <span className={duration !== null ? 'tf24-grad-word' : ''} style={{ fontFamily: 'Bebas Neue', fontSize: 54, lineHeight: 1, color: duration !== null ? TURF_GREEN : 'rgba(243,243,243,0.25)' }}>
                        {duration !== null ? `₹${duration * HOURLY_RATE}` : '₹---'}
                      </span>
                    </div>
                  </div>

                  <div className="tf24-summary-item" style={{ animationDelay: '0.22s' }}>
                    <div style={{ padding: '12px 0', borderTop: '1px solid rgba(243,243,243,0.1)', borderBottom: '1px solid rgba(243,243,243,0.1)', fontFamily: 'Space Grotesk', fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.45)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: TURF_GREEN }} />
                      {RATE_LABEL}
                    </div>
                  </div>

                  <div className="tf24-summary-item" style={{ animationDelay: '0.26s' }}>
                    <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Space Grotesk', fontSize: 10.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.45)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: TURF_GREEN }} />
                      TURF SESSION
                    </div>
                  </div>

                  {start !== null && duration !== null && (
                    <div className="tf24-summary-item tf24-pay-zone" style={{ animationDelay: '0.42s' }}>
                      <button
                        type="button"
                        className="tf24-booking-cta"
                        style={{ marginTop: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: TURF_GREEN, color: '#0B0B0B', textDecoration: 'none', padding: '20px 26px', fontFamily: 'Space Grotesk', fontSize: 14, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: start !== null && duration !== null ? 1 : 0.5, cursor: start !== null && duration !== null ? 'pointer' : 'not-allowed', border: 'none', width: '100%' }}
                        onClick={() => openPaymentModal()}
                      >
                        CONTINUE BOOKING
                        <span className="tf24-booking-arrow">→</span>
                      </button>

                      <p style={{ margin: '20px 0 0', fontFamily: 'Space Grotesk', fontSize: 11.5, lineHeight: 1.7, color: 'rgba(243,243,243,0.4)' }}>
                        Free cancellation up to 2 hours before your session. Pay on arrival or online.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {paymentOpen
        ? createPortal(
            <div
              className="tf24-payment-overlay"
              role="presentation"
              onClick={() => setPaymentOpen(false)}
            >
              <div
                className={'tf24-payment-modal' + (paymentSuccess ? ' tf24-payment-modal--success' : '')}
                role="dialog"
                aria-modal="true"
                aria-labelledby="tf24-payment-title"
                onClick={e => e.stopPropagation()}
              >
                <div className="tf24-modal-corner tf24-modal-corner-tl" />
                <div className="tf24-modal-corner tf24-modal-corner-br" />

                {paymentSuccess ? (
                  /* ── SUCCESS STATE ── */
                  <>
                    <div className="tf24-success-content">
                      <div className="tf24-success-check">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="tf24-success-heading">Thank You!</div>
                      <div className="tf24-success-msg">Your slot has been booked successfully.</div>
                      <div className="tf24-success-sub">Our team will reach you soon.</div>
                      <button
                        type="button"
                        className="tf24-success-close"
                        onClick={() => {
                          setPaymentOpen(false)
                          setPaymentSuccess(false)
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </>
                ) : (
                  /* ── BOOKING / PAYMENT STATE ── */
                  <>
                    <div
                      id="tf24-payment-title"
                      className="tf24-payment-title"
                    >
                      Confirm Your Booking
                    </div>

                    <div className="tf24-payment-content">
                      {/* BOOKING SUMMARY */}
                      <div className="tf24-payment-summary">
                        <div className="tf24-payment-section-title">
                          Booking Summary
                        </div>

                        <div className="tf24-payment-details">
                          <div className="tf24-payment-row">
                            <span>Date</span>
                            <strong>{dates[dateIdx].label}</strong>
                          </div>

                          <div className="tf24-payment-row">
                            <span>Time</span>
                            <strong>
                              {start !== null ? time(start) : '--'}
                            </strong>
                          </div>

                          <div className="tf24-payment-row">
                            <span>Duration</span>
                            <strong>
                              {duration !== null
                                ? `${duration} Hours`
                                : '--'}
                            </strong>
                          </div>

                          <div className="tf24-payment-divider" />

                          <div className="tf24-payment-row tf24-payment-total">
                            <span>Amount</span>
                            <strong>
                              ₹{duration !== null ? totalPrice : '---'}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* QR CODE */}
                      <div className="tf24-payment-qr-section">
                        <div className="tf24-payment-section-title">
                          Scan to Pay
                        </div>

                        <div className="tf24-payment-qr-box">
                          <QrCode
                            payload={`TF24|${dates[dateIdx].label}|${
                              start !== null ? time(start) : '--'
                            }|${duration ?? 0}h|₹${totalPrice}`}
                            color="#0B0B0B"
                            bg="#F2F4F2"
                          />
                        </div>

                        <div className="tf24-payment-qr-help">
                          Scan the QR code to complete payment.
                        </div>
                      </div>
                    </div>

                    <div className="tf24-payment-actions">
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentOpen(false)
                          setPaymentSuccess(false)
                        }}
                        className="tf24-payment-cancel"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handlePaymentSuccess}
                        className="tf24-payment-paid"
                      >
                        I've Paid →
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}


      <style>{`
        .tf24-payment-overlay {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100dvh;
          min-height: 100vh;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          margin: 0;
          background: rgba(0, 0, 0, 0.82);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 2147483647;
          overflow: hidden;
          overscroll-behavior: none;
          isolation: isolate;
        }

        .tf24-payment-modal {
          position: relative;
          box-sizing: border-box;
          width: min(860px, calc(100vw - 32px));
          max-width: 860px;
          max-height: calc(100dvh - 32px);
          margin: 0;
          padding: 28px;
          overflow: hidden;
          background: rgba(7, 13, 22, 0.99);
          border: 1px solid rgba(57, 255, 122, 0.5);
          border-radius: 20px;
          box-shadow:
            0 0 100px rgba(57, 255, 122, 0.18),
            inset 0 0 40px rgba(57, 255, 122, 0.04);
        }

        .tf24-modal-corner {
          position: absolute;
          width: 55px;
          height: 55px;
          pointer-events: none;
        }

        .tf24-modal-corner-tl {
          top: 0;
          left: 0;
          border-top: 2px solid rgba(57, 255, 122, 0.8);
          border-left: 2px solid rgba(57, 255, 122, 0.8);
          border-radius: 5px 0 0 0;
        }

        .tf24-modal-corner-br {
          right: 0;
          bottom: 0;
          border-right: 2px solid rgba(57, 255, 122, 0.8);
          border-bottom: 2px solid rgba(57, 255, 122, 0.8);
          border-radius: 0 0 5px 0;
        }

        .tf24-payment-title {
          position: relative;
          z-index: 1;
          margin: 0 0 22px;
          font-family: 'Bebas Neue';
          font-size: clamp(26px, 3vw, 34px);
          line-height: 1;
          letter-spacing: 0.05em;
          color: ${TURF_GREEN};
          text-align: center;
          text-transform: uppercase;
        }

        .tf24-payment-content {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(240px, 300px);
          gap: 22px;
          align-items: center;
        }

        .tf24-payment-summary {
          box-sizing: border-box;
          padding: 20px;
          background: rgba(243, 243, 243, 0.025);
          border: 1px solid rgba(243, 243, 243, 0.08);
          border-radius: 14px;
        }

        .tf24-payment-section-title {
          margin-bottom: 16px;
          font-family: 'Space Grotesk';
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: ${TURF_GREEN};
          text-align: center;
          text-transform: uppercase;
        }

        .tf24-payment-details {
          display: grid;
          gap: 13px;
          font-family: 'Space Grotesk';
          color: #F2F4F2;
        }

        .tf24-payment-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          min-height: 22px;
          font-size: 13px;
        }

        .tf24-payment-row > span {
          color: rgba(243, 243, 243, 0.5);
        }

        .tf24-payment-row > strong {
          color: #F2F4F2;
          font-weight: 600;
          text-align: right;
        }

        .tf24-payment-divider {
          width: 100%;
          height: 1px;
          margin: 3px 0;
          background: rgba(243, 243, 243, 0.1);
        }

        .tf24-payment-total > strong {
          font-family: 'Bebas Neue';
          font-size: 32px;
          line-height: 1;
          color: ${TURF_GREEN};
        }

        .tf24-payment-qr-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 0;
        }

        .tf24-payment-qr-box {
          box-sizing: border-box;
          width: min(230px, 100%);
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          overflow: hidden;
          background: #F2F4F2;
          border-radius: 12px;
        }

        .tf24-payment-qr-box svg {
          display: block;
          width: 100%;
          height: 100%;
          max-width: 100%;
          max-height: 100%;
        }

        .tf24-payment-qr-help {
          margin-top: 8px;
          font-family: 'Space Grotesk';
          font-size: 10px;
          line-height: 1.4;
          color: rgba(243, 243, 243, 0.55);
          text-align: center;
        }

        .tf24-payment-actions {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 22px;
        }

        .tf24-payment-actions button {
          box-sizing: border-box;
          width: 100%;
          min-height: 50px;
          padding: 12px 14px;
          border-radius: 8px;
          font-family: 'Space Grotesk';
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tf24-payment-cancel {
          border: 1px solid rgba(243, 243, 243, 0.25);
          background: rgba(243, 243, 243, 0.06);
          color: #F2F4F2;
        }

        .tf24-payment-cancel:hover {
          background: rgba(243, 243, 243, 0.12);
          border-color: rgba(243, 243, 243, 0.45);
        }

        .tf24-payment-paid {
          border: none;
          background: ${TURF_GREEN};
          color: #0B0B0B;
          box-shadow: 0 0 20px rgba(57, 255, 122, 0.35);
        }

        .tf24-payment-paid:hover {
          box-shadow: 0 0 30px rgba(57, 255, 122, 0.5);
        }

        @media (max-width: 700px) {
          .tf24-payment-overlay {
            padding: 10px;
          }

          .tf24-payment-modal {
            width: calc(100vw - 20px);
            max-height: calc(100dvh - 20px);
            padding: 20px 16px;
            border-radius: 16px;
          }

          .tf24-payment-content {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .tf24-payment-summary {
            padding: 16px;
          }

          .tf24-payment-qr-box {
            width: min(180px, 55vw);
          }

          .tf24-payment-actions {
            margin-top: 16px;
            gap: 8px;
          }
        }

        @keyframes tf24-text-glow {
          0%, 100% {
            textShadow: 0 0 20px rgba(57, 255, 122, 0.4), 0 0 40px rgba(57, 255, 122, 0.2);
          }
          50% {
            textShadow: 0 0 30px rgba(57, 255, 122, 0.6), 0 0 60px rgba(57, 255, 122, 0.3);
          }
        }

        .tf24-success-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 32px 20px 16px;
          min-height: 280px;
          position: relative;
          z-index: 1;
        }

        .tf24-success-check {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 2.5px solid ${TURF_GREEN};
          background: rgba(57, 255, 122, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 32px rgba(57, 255, 122, 0.35), 0 0 64px rgba(57, 255, 122, 0.15);
          animation: tf24-success-check-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
        }

        .tf24-success-check svg {
          width: 36px;
          height: 36px;
          stroke: ${TURF_GREEN};
          stroke-width: 3;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .tf24-success-heading {
          margin: 28px 0 0;
          font-family: 'Bebas Neue';
          font-size: clamp(32px, 4vw, 44px);
          line-height: 1;
          letter-spacing: 0.06em;
          color: ${TURF_GREEN};
          text-transform: uppercase;
          text-shadow: 0 0 24px rgba(57, 255, 122, 0.35), 0 0 48px rgba(57, 255, 122, 0.15);
          animation: tf24-success-text-in 0.45s ease-out 0.35s both;
        }

        .tf24-success-msg {
          margin: 16px 0 0;
          font-family: 'Space Grotesk';
          font-size: 14px;
          font-weight: 500;
          line-height: 1.7;
          color: rgba(243, 243, 243, 0.85);
          animation: tf24-success-text-in 0.4s ease-out 0.55s both;
        }

        .tf24-success-sub {
          margin: 6px 0 0;
          font-family: 'Space Grotesk';
          font-size: 13px;
          line-height: 1.7;
          color: rgba(243, 243, 243, 0.55);
          animation: tf24-success-text-in 0.4s ease-out 0.7s both;
        }

        .tf24-success-close {
          margin-top: 32px;
          min-width: 160px;
          min-height: 50px;
          padding: 14px 28px;
          border: 1px solid rgba(243, 243, 243, 0.25);
          background: rgba(243, 243, 243, 0.06);
          color: #F2F4F2;
          border-radius: 8px;
          font-family: 'Space Grotesk';
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          animation: tf24-success-text-in 0.4s ease-out 0.85s both;
        }

        .tf24-success-close:hover {
          background: rgba(243, 243, 243, 0.12);
          border-color: rgba(243, 243, 243, 0.45);
        }

        @keyframes tf24-success-check-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes tf24-success-text-in {
          0% {
            transform: translateY(10px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .tf24-payment-modal.tf24-payment-modal--success {
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          border-color: rgba(57, 255, 122, 0.7);
          box-shadow:
            0 0 120px rgba(57, 255, 122, 0.28),
            inset 0 0 50px rgba(57, 255, 122, 0.06);
        }
      `}</style>
    </section>
  )
}