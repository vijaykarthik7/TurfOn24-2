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
          <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 600, letterSpacing: '5px', textTransform: 'uppercase', color: '#39FF7A', textShadow: '0 0 14px rgba(57,255,122,0.5)', marginBottom: 30 }}>
            About Turf on 24
          </div>

          <h2 style={{ fontFamily: 'Bebas Neue', fontWeight: 900, fontSize: 'clamp(52px, 6.5vw, 82px)', textTransform: 'uppercase', lineHeight: 0.91, letterSpacing: '-1px', margin: 0, color: '#F2F4F2', maxWidth: 700, marginBottom: 32 }}>
            Built for the way
            <br />
            You love
            <br />
            <span style={{ color: '#39FF7A' }}>To play.</span>
          </h2>

          <p style={{ fontFamily: 'Space Grotesk', fontSize: 17, fontWeight: 400, lineHeight: 1.65, color: 'rgba(243,243,243,0.75)', maxWidth: 560, margin: '0 0 24px' }}>
            We created Turf on 24 with one simple idea — give players a place where they can focus on the game and enjoy every minute of it.
          </p>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: 17, fontWeight: 400, lineHeight: 1.65, color: 'rgba(243,243,243,0.75)', maxWidth: 560, margin: '0 0 40px' }}>
            From the quality of the turf to the lighting, seating, and everyday facilities, we've taken care of the details that make a good game feel like a great one.
          </p>

          {/* Statement */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 48 }}>
            <div style={{ width: 2, height: 38, background: '#39FF7A', flexShrink: 0 }} />
            <span style={{ fontFamily: 'Bebas Neue', fontSize: 20, fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#F2F4F2', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              Good games start with a great ground.
            </span>
          </div>

          {/* Statistics */}
          <div className="about-stats">
            <div>
              <div className="tf24-grad-word" style={{ fontFamily: 'Bebas Neue', fontWeight: 900, fontSize: 40, color: '#39FF7A', lineHeight: 1 }}>
                100%
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#F2F4F2', marginTop: 8 }}>
                Turf Quality
              </div>
            </div>
            <div>
              <div className="tf24-grad-word" style={{ fontFamily: 'Bebas Neue', fontWeight: 900, fontSize: 40, color: '#39FF7A', lineHeight: 1 }}>
                7 Days
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#F2F4F2', marginTop: 8 }}>
                Availability
              </div>
            </div>
            <div>
              <div className="tf24-grad-word" style={{ fontFamily: 'Bebas Neue', fontWeight: 900, fontSize: 40, color: '#39FF7A', lineHeight: 1 }}>
                Players
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#F2F4F2', marginTop: 8 }}>
                Book Any Time
              </div>
            </div>
          </div>
        </div>

        {/* Image side */}
        <div ref={imgRef} className="reveal-right" style={{ minWidth: 0, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Background decorative cubes */}
          <div style={{ position: 'absolute', top: -30, left: -40, width: 110, height: 110, background: 'linear-gradient(135deg, rgba(57,255,122,0.2) 0%, rgba(57,255,122,0.05) 100%)', border: '1px solid rgba(57,255,122,0.3)', borderRadius: 10, transform: 'rotate(15deg)', boxShadow: '0 0 25px rgba(57,255,122,0.2)' }} />
          <div style={{ position: 'absolute', top: -15, left: 15, width: 85, height: 85, background: 'linear-gradient(135deg, #030607 0%, #1a1a2e 100%)', border: '1px solid rgba(243,243,243,0.1)', borderRadius: 8, transform: 'rotate(-10deg)' }} />
          <div style={{ position: 'absolute', bottom: -20, right: -35, width: 95, height: 95, background: 'linear-gradient(135deg, rgba(57,255,122,0.15) 0%, rgba(57,255,122,0.03) 100%)', border: '1px solid rgba(57,255,122,0.25)', borderRadius: 9, transform: 'rotate(20deg)', boxShadow: '0 0 22px rgba(57,255,122,0.15)' }} />
          <div style={{ position: 'absolute', bottom: 10, right: 20, width: 70, height: 70, background: 'linear-gradient(135deg, #030607 0%, #1a1a2e 100%)', border: '1px solid rgba(243,243,243,0.08)', borderRadius: 7, transform: 'rotate(-15deg)' }} />
          
          {/* Neon frame behind image */}
          <div style={{
            position: 'absolute',
            zIndex: 0,
            width: '87%',
            height: 490,
            borderRadius: 22,
            border: '2px solid rgba(57,255,122,0.6)',
            boxShadow: '0 0 20px rgba(57,255,122,0.4), 0 0 40px rgba(57,255,122,0.2), inset 0 0 20px rgba(57,255,122,0.1)',
            top: -5,
            left: '50%',
            transform: 'translateX(-50%)'
          }} />

          {/* Main image with curved edges */}
          <img
            src={IMG}
            alt="Players playing soccer on turf field"
            style={{ 
              width: '85%', 
              height: 480, 
              objectFit: 'cover', 
              display: 'block',
              borderRadius: 20,
              position: 'relative',
              zIndex: 1
            }}
          />
        </div>
        </div>
      </div>
    </section>
  )
}
