import { useReveal } from '../hooks/useReveal'
import { LIME } from '../data/tf24'

const IMG_TURF = 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900&h=1300&fit=crop&auto=format&q=80'
const IMG_MATCH = 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1200&h=700&fit=crop&auto=format&q=80'
const IMG_FOOTBALL = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=700&fit=crop&auto=format&q=80'
const IMG_CRICKET = 'https://images.unsplash.com/photo-1759733841123-b8e1d75ee45c?w=800&h=700&fit=crop&auto=format&q=80'

function Card({
  src,
  alt,
  className,
  tag,
}: {
  src: string
  alt: string
  className: string
  tag: string
}) {
  return (
    <figure className={`gallery-item ${className}`} style={{ margin: 0 }}>
      <img src={src} alt={alt} loading="lazy" />
      <div className="gallery-dim" />
      <span className="gallery-tag">{tag}</span>
    </figure>
  )
}

export default function Gallery() {
  const headRef = useReveal<HTMLDivElement>('in', 0.15)
  const gridRef = useReveal<HTMLDivElement>('in', 0.1)

  return (
    <section id="gallery" style={{ background: 'rgba(11,24,36,0.55)', padding: '120px 0', overflow: 'hidden' }}>
      <div className="tf24-container" style={{ position: 'relative' }}>
        {/* Header */}
        <div ref={headRef} className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 40, flexWrap: 'wrap', marginBottom: 52 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <span style={{ width: 26, height: 2, background: '#39FF14' }} />
              <span style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#39FF14', textShadow: '0 0 14px rgba(57,255,20,0.5)' }}>
                The Turf
              </span>
            </div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontWeight: 400, fontSize: 'clamp(48px, 7vw, 110px)', textTransform: 'uppercase', lineHeight: 0.9, margin: 0, color: '#F3F3F3' }}>
              See where the
              <br />
              <span style={{ color: '#39F72A' }}>game happens.</span>
            </h2>
          </div>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: 16, lineHeight: 1.7, color: 'rgba(243,243,243,0.7)', maxWidth: 320, margin: 0 }}>
            From intense evening matches under the lights to relaxed weekend games with friends.
          </p>
        </div>

        {/* Gallery grid */}
        <div ref={gridRef} className="reveal gallery-grid">
          <Card
            className="gallery-a"
            src={IMG_TURF}
            alt="Floodlit turf facility from above"
            tag="01 / Turf"
          />
          <figure className="gallery-item gallery-b" style={{ margin: 0 }}>
            <img src={IMG_MATCH} alt="Football match moment under the lights" loading="lazy" />
            <div className="gallery-dim" />
            <div className="gallery-grad" />
            <span className="gallery-tag">02 / Match</span>
            <div className="gallery-caption">
              <span className="gallery-move" style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: LIME }}>
                View Moment →
              </span>
              <span style={{ fontFamily: 'Bebas Neue', fontSize: 44, letterSpacing: '0.04em', color: '#F3F3F3', lineHeight: 1 }}>
                Match Time
              </span>
            </div>
          </figure>
          <Card
            className="gallery-c"
            src={IMG_CRICKET}
            alt="Cricket practice on turf"
            tag="03 / Cricket"
          />
          <Card
            className="gallery-d"
            src={IMG_FOOTBALL}
            alt="Players training on artificial turf"
            tag="04 / Play"
          />
        </div>
      </div>
    </section>
  )
}
