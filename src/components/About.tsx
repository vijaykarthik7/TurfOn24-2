import { useReveal } from '../hooks/useReveal'

const IMG = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=960&fit=crop&auto=format'

export default function About() {
  const textRef = useReveal<HTMLDivElement>('in', 0.1)
  const imgRef = useReveal<HTMLDivElement>('in', 0.15)

  return (
    <section id="about" style={{ background: 'rgba(11,24,36,0.55)', overflow: 'hidden', padding: '120px 0' }}>
      <div className="tf24-container">
        <div className="resp-two-col" style={{ display: 'grid', gridTemplateColumns: '47fr 53fr', gap: 64, alignItems: 'center' }}>

        {/* Text side */}
        <div ref={textRef} className="reveal-left" style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 600, letterSpacing: '5px', textTransform: 'uppercase', color: '#18AAC0', textShadow: '0 0 14px rgba(24,170,192,0.5)', marginBottom: 30 }}>
            About Turf on 24
          </div>

          <h2 style={{ fontFamily: 'Bebas Neue', fontWeight: 900, fontSize: 'clamp(52px, 6.5vw, 82px)', textTransform: 'uppercase', lineHeight: 0.91, letterSpacing: '-1px', margin: 0, color: '#F3F3F3', maxWidth: 700, marginBottom: 32 }}>
            Built for the way
            <br />
            You love
            <br />
            <span style={{ color: '#39F72A' }}>To play.</span>
          </h2>

          <p style={{ fontFamily: 'Space Grotesk', fontSize: 17, fontWeight: 400, lineHeight: 1.65, color: 'rgba(243,243,243,0.75)', maxWidth: 560, margin: '0 0 24px' }}>
            We created Turf on 24 with one simple idea — give players a place where they can focus on the game and enjoy every minute of it.
          </p>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: 17, fontWeight: 400, lineHeight: 1.65, color: 'rgba(243,243,243,0.75)', maxWidth: 560, margin: '0 0 40px' }}>
            From the quality of the turf to the lighting, seating, and everyday facilities, we've taken care of the details that make a good game feel like a great one.
          </p>

          {/* Statement */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 48 }}>
            <div style={{ width: 2, height: 38, background: '#18AAC0', flexShrink: 0 }} />
            <span style={{ fontFamily: 'Bebas Neue', fontSize: 20, fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#F3F3F3', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              Good games start with a great ground.
            </span>
          </div>

          {/* Statistics */}
          <div className="about-stats">
            <div>
              <div className="tf24-grad-word" style={{ fontFamily: 'Bebas Neue', fontWeight: 900, fontSize: 40, color: '#39F72A', lineHeight: 1 }}>
                100%
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#F3F3F3', marginTop: 8 }}>
                Turf Quality
              </div>
            </div>
            <div>
              <div className="tf24-grad-word" style={{ fontFamily: 'Bebas Neue', fontWeight: 900, fontSize: 40, color: '#39F72A', lineHeight: 1 }}>
                7 Days
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#F3F3F3', marginTop: 8 }}>
                Availability
              </div>
            </div>
            <div>
              <div className="tf24-grad-word" style={{ fontFamily: 'Bebas Neue', fontWeight: 900, fontSize: 40, color: '#39F72A', lineHeight: 1 }}>
                Players
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#F3F3F3', marginTop: 8 }}>
                Book Any Time
              </div>
            </div>
          </div>
        </div>

        {/* Image side */}
        <div ref={imgRef} className="reveal-right" style={{ minWidth: 0 }}>
          <img
            src={IMG}
            alt="Players playing soccer on turf field"
            style={{ width: '100%', height: 560, objectFit: 'cover', display: 'block' }}
          />
        </div>
        </div>
      </div>
    </section>
  )
}
