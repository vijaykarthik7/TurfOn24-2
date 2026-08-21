import { useReveal } from '../hooks/useReveal'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

import about1 from '../assets/about-1.jpg?inline'
import about4 from '../assets/about-4.jpg?inline'
import about3 from '../assets/about-3.jpg?inline'

const IMG_TURF = about1
const IMG_FOOTBALL = about4
const IMG_CRICKET = about3

const EASE = [0.16, 1, 0.3, 1] as const

function CollageImage({ src, alt, cls, delay, mvx, mvy }: { src: string; alt: string; cls: string; delay: number; mvx: unknown; mvy: unknown }) {
  return (
    <motion.div className={`tf24-cl-layer ${cls}`} style={{ x: mvx as never, y: mvy as never }}>
      <motion.div
        className="tf24-cl-img"
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.75, delay, ease: EASE }}
        whileHover={{ scale: 1.02 }}
      >
        <img src={src} alt={alt} />
        <span className="tf24-cl-shade" />
      </motion.div>
    </motion.div>
  )
}

function AboutCollage() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })

  const turfX = useTransform(sx, v => v * 8)
  const turfY = useTransform(sy, v => v * 6)
  const playerX = useTransform(sx, v => v * -14)
  const playerY = useTransform(sy, v => v * -10)
  const ballX = useTransform(sx, v => v * -18)
  const ballY = useTransform(sy, v => v * -13)
  const decorX = useTransform(sx, v => v * -10)
  const decorY = useTransform(sy, v => v * -8)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <div className="tf24-cl-root" onMouseMove={handleMove} onMouseLeave={() => { mx.set(0); my.set(0) }}>
      {/* Decorative neon geometry */}
      <motion.div style={{ x: decorX, y: decorY }} className="tf24-cl-decor tf24-cl-ring" aria-hidden="true" />
      <motion.div style={{ x: decorX, y: decorY }} className="tf24-cl-decor tf24-cl-dots" aria-hidden="true" />
      <motion.div style={{ x: decorX, y: decorY }} className="tf24-cl-decor tf24-cl-square" aria-hidden="true" />

      {/* Large turf image */}
      <CollageImage src={IMG_TURF} alt="Floodlit turf ground at Turf on 24" cls="tf24-cl-turf" delay={0.05} mvx={turfX} mvy={turfY} />

      {/* Upper card: football */}
      <CollageImage src={IMG_FOOTBALL} alt="Football close-up" cls="tf24-cl-player" delay={0.22} mvx={playerX} mvy={playerY} />

      {/* Lower card: cricket */}
      <CollageImage src={IMG_CRICKET} alt="Cricket close-up" cls="tf24-cl-ball" delay={0.38} mvx={ballX} mvy={ballY} />
    </div>
  )
}

export default function About() {
  const textRef = useReveal<HTMLDivElement>('in', 0.1)
  const imgRef = useReveal<HTMLDivElement>('in', 0.15)

  return (
    <section id="about" style={{ position: 'relative', background: 'rgba(11,24,36,0.55)', overflow: 'hidden', padding: '120px 0' }}>
      {/* Atmospheric depth — subtle blue radial glow over the stadium artwork showing through */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 28%, rgba(0,201,255,0.14), transparent 62%)',
          pointerEvents: 'none',
        }}
      />

      {/* Blue-blue-black bottom fade — same as Hero */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 200,
          pointerEvents: 'none',
          zIndex: 1,
          background:
            'linear-gradient(to bottom, rgba(3,12,20,0) 0%, rgba(3,15,25,0.35) 55%, rgba(3,15,25,0.75) 100%)',
        }}
      />
      <div className="tf24-container" style={{ position: 'relative', zIndex: 1 }}>
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

        {/* Collage side */}
        <div ref={imgRef} className="reveal-right" style={{ minWidth: 0 }}>
          <AboutCollage />
        </div>
        </div>
      </div>
    </section>
  )
}
