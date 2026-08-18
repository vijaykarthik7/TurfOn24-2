import { GREEN } from '../data/tf24'

const PITCH_IMG = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1000&h=800&fit=crop&auto=format&q=80'
import Reveal from './Reveal'

export default function CTA() {
  return (
    <section id="ready" style={{ position: 'relative', zIndex: 2, padding: '150px 0', background: 'radial-gradient(ellipse at 50% 120%, rgba(23,107,2,0.28), rgba(0,0,0,0) 60%)', backgroundColor: 'rgba(0,0,0,0.92)', overflow: 'hidden' }}>
      {/* Faint TURFON24 watermark */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'Bebas Neue',
          fontSize: 'clamp(120px, 22vw, 300px)',
          color: 'rgba(23,107,2,0.14)',
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        TURFON24
      </div>

      <div className="tf24-container tf24-cta-layout" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
        <Reveal>
          <div style={{ maxWidth: 520 }}>
            <div className="tf24-kicker">Kickoff Awaits</div>
            <h2 className="tf24-display" style={{ fontSize: 'clamp(52px, 7vw, 104px)', margin: '12px 0 0', lineHeight: 0.92 }}>
              Ready
              <br />
              To <span style={{ color: GREEN }}>Play?</span>
            </h2>
            <p style={{ margin: '22px 0 32px', fontFamily: 'Space Grotesk', fontSize: 14.5, lineHeight: 1.75, color: 'rgba(243,243,243,0.72)' }}>
              Your next game is closer than you think.
            </p>
            <a href="/booking" className="tf24-btn-primary">
              Book Your Turf <span className="tf24-arrow">→</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div style={{ position: 'relative', height: 440 }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 50% 55%, rgba(57,247,42,0.22), rgba(23,107,2,0.45) 60%, transparent 75%)',
              }}
            />
            <img
              src={PITCH_IMG}
              alt="Player walking onto the turf"
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                height: '108%',
                maxWidth: 'none',
                width: 'auto',
                objectFit: 'cover',
                filter: 'grayscale(1) contrast(1.2) brightness(0.6)',
                mixBlendMode: 'multiply',
              }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
