import { GREEN, STATS } from '../data/tf24'
import Reveal from './Reveal'

export default function Stats() {
  return (
    <section
      id="stats"
      style={{
        position: 'relative',
        zIndex: 2,
        borderTop: '1px solid rgba(243,243,243,0.08)',
        borderBottom: '1px solid rgba(243,243,243,0.08)',
        background: 'radial-gradient(ellipse at 50% 120%, rgba(23,107,2,0.28), rgba(0,0,0,0) 60%)',
        backgroundColor: 'rgba(0,0,0,0.92)',
        padding: '64px 0',
      }}
    >
      <Reveal>
        <div
          className="tf24-container tf24-stats"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                padding: '10px 16px',
                borderLeft: i === 0 ? 'none' : '1px solid rgba(243,243,243,0.14)',
              }}
            >
              <div>
                <div style={{ fontFamily: 'Bebas Neue', fontSize: 44, lineHeight: 1, color: GREEN, letterSpacing: '0.02em' }}>
                  {s.value}
                </div>
                <div style={{ marginTop: 6, fontFamily: 'Space Grotesk', fontSize: 12.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#F2F4F2' }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
