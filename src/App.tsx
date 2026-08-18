import Admin from './components/admin/Admin'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Features from './components/Features'
import Gallery from './components/Gallery'
import BookingFlow from './components/BookingFlow'
import Contact from './components/Contact'
import Footer from './components/Footer'
import RadarBooking from './components/RadarBooking'

const BG = new URL('./assets/stadium-bg.png', import.meta.url).href

export default function App() {
  if (window.location.pathname.startsWith('/admin')) {
    return <Admin />
  }

  if (window.location.pathname.startsWith('/booking')) {
    return (
      <div style={{ background: '#000000', color: '#F5F5F5', overflowX: 'hidden' }}>
        <div className="bg-3d">
          <div
            className="bg-3d-zoom"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${BG})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
              filter: 'brightness(0.5) saturate(0.9)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.4) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <RadarBooking />
        </div>
      </div>
    )
  }

  return (
    <div id="tf24" style={{ position: 'relative', background: '#000000', color: '#F3F3F3', overflowX: 'hidden' }}>
      <div className="bg-3d">
        <div
          className="bg-3d-zoom"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${BG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            filter: 'brightness(0.7) saturate(1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 42%, rgba(0,0,0,0.18) 74%, rgba(0,0,0,0.4) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.6) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav />
        <main>
          <Hero />
          <About />
          <Features />
          <Gallery />
          <BookingFlow />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  )
}
