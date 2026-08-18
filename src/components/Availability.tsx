import { useMemo, useState } from 'react'
import { GREEN, CYAN, TURF_NAMES, seeded, fmtDate, fmtHour, SLOT_START, SLOT_COUNT } from '../data/tf24'
import Reveal from './Reveal'

export default function Availability() {
  const [dateIdx, setDateIdx] = useState(0)
  const [turf, setTurf] = useState(TURF_NAMES[0])
  const [selected, setSelected] = useState<number | null>(null)

  const dates = useMemo(() => {
    const out: { date: Date; label: string }[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      out.push({ date: d, label: i === 0 ? `Today · ${fmtDate(d)}` : fmtDate(d) })
    }
    return out
  }, [])

  const isBooked = (h: number) => seeded(`${fmtDate(dates[dateIdx].date)}-${turf}-${h}`) % 3 === 0

  const slots = Array.from({ length: SLOT_COUNT }, (_, i) => SLOT_START + i)

  return (
    <section id="play" style={{ position: 'relative', zIndex: 2, background: 'radial-gradient(ellipse at 30% 40%, rgba(23,107,2,0.2), rgba(0,0,0,0) 60%)', backgroundColor: 'rgba(0,0,0,0.92)', padding: '128px 0' }}>
      <div className="tf24-container">
        <div className="tf24-avail-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          {/* Left copy */}
          <Reveal>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <span className="tf24-live-dot" />
                <span style={{ fontFamily: 'Space Grotesk', fontSize: 11, letterSpacing: '0.26em', textTransform: 'uppercase', color: CYAN, fontWeight: 700 }}>
                  Live
                </span>
              </div>
              <h2 className="tf24-display" style={{ fontSize: 'clamp(48px, 5.5vw, 80px)', margin: 0, lineHeight: 0.94 }}>
                Play When
                <br />
                You <span style={{ color: GREEN }}>Want.</span>
              </h2>
              <p style={{ margin: '24px 0 0', maxWidth: 420, fontFamily: 'Space Grotesk', fontSize: 14.5, lineHeight: 1.75, color: 'rgba(243,243,243,0.72)' }}>
                Real-time availability. Book your slot instantly.
              </p>
            </div>
          </Reveal>

          {/* Right interface */}
          <Reveal delay={120}>
            <div
              style={{
                background: 'rgba(0,0,0,0.85)',
                border: '1px solid rgba(57,247,42,0.45)',
                boxShadow: '0 0 46px rgba(57,247,42,0.14), 0 24px 60px rgba(0,0,0,0.5)',
                borderRadius: 10,
                padding: 30,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: 30, color: '#F3F3F3', letterSpacing: '0.03em' }}>
                  Live <span style={{ color: GREEN }}>Availability</span>
                </div>
                <span className="tf24-live-dot" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontFamily: 'Space Grotesk', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.5)' }}>Date</label>
                  <select
                    value={dateIdx}
                    onChange={e => { setDateIdx(Number(e.target.value)); setSelected(null) }}
                    style={{
                      width: '100%', marginTop: 8, background: '#0a0a0a', border: '1px solid rgba(243,243,243,0.16)',
                      color: '#F3F3F3', padding: '11px 12px', fontFamily: 'Space Grotesk', fontSize: 13, outline: 'none', cursor: 'pointer',
                    }}
                  >
                    {dates.map((d, i) => (
                      <option key={i} value={i}>{d.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'Space Grotesk', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.5)' }}>Turf</label>
                  <select
                    value={turf}
                    onChange={e => { setTurf(e.target.value); setSelected(null) }}
                    style={{
                      width: '100%', marginTop: 8, background: '#0a0a0a', border: '1px solid rgba(243,243,243,0.16)',
                      color: '#F3F3F3', padding: '11px 12px', fontFamily: 'Space Grotesk', fontSize: 13, outline: 'none', cursor: 'pointer',
                    }}
                  >
                    {TURF_NAMES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 22, fontFamily: 'Space Grotesk', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.5)' }}>
                Select Time Slot
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 10 }}>
                {slots.map(h => {
                  const booked = isBooked(h)
                  const active = selected === h
                  return (
                    <button
                      key={h}
                      disabled={booked}
                      onClick={() => setSelected(h)}
                      style={{
                        fontFamily: 'Space Grotesk', fontSize: 12.5, padding: '12px 4px', borderRadius: 6, cursor: booked ? 'not-allowed' : 'pointer',
                        border: active ? `1px solid ${GREEN}` : booked ? '1px solid rgba(243,243,243,0.1)' : `1px solid rgba(57,247,42,0.55)`,
                        background: active ? GREEN : booked ? '#121212' : 'rgba(57,247,42,0.08)',
                        color: active ? '#000000' : booked ? 'rgba(243,243,243,0.25)' : GREEN,
                        fontWeight: 700,
                        textDecoration: booked ? 'line-through' : 'none',
                        boxShadow: active ? '0 0 18px rgba(57,247,42,0.45)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {fmtHour(h)}
                    </button>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: 20, marginTop: 20, fontFamily: 'Space Grotesk', fontSize: 11, color: 'rgba(243,243,243,0.6)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 10, height: 10, background: GREEN, borderRadius: 2 }} /> Available
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 10, height: 10, background: '#121212', border: '1px solid rgba(243,243,243,0.25)', borderRadius: 2 }} /> Booked
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 10, height: 10, background: CYAN, borderRadius: 2, boxShadow: '0 0 8px rgba(24,170,192,0.7)' }} /> Live
                </span>
              </div>

              <a
                href="/booking"
                className="tf24-btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 24, padding: '14px 18px' }}
              >
                Book This Slot <span className="tf24-arrow">→</span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
