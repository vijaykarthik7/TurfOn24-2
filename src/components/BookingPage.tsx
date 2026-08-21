import { useState } from 'react'
import { useVerification } from '../hooks/useVerification'
import Pricing from './Pricing'
import ExtendedBooking from './ExtendedBooking'
import Footer from './Footer'
import { GREEN } from '../data/tf24'
import logoMark from '../assets/Logo.png'

export default function BookingPage() {
  const verification = useVerification()
  const [showArena, setShowArena] = useState(false)

  return (
    <div style={{ background: '#030607', color: '#F2F4F2', minHeight: '100vh' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(3,19,38,0.9)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(160,168,184,0.15)',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, padding: '0 24px' }}>
          <a href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>
            <img src={logoMark} alt="TURFON24" style={{ height: 38, width: 'auto', maxWidth: 'none', display: 'block' }} />
          </a>
          <a
            href="/"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#A0A8B8', textDecoration: 'none', border: '1px solid rgba(160,168,184,0.35)', padding: '9px 16px', borderRadius: 8, transition: 'all 0.2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#39FF7A'; e.currentTarget.style.color = '#39FF7A' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(160,168,184,0.35)'; e.currentTarget.style.color = '#A0A8B8' }}
          >
            ← Back to Home
          </a>
        </div>
      </header>

      <div className="container" style={{ padding: '0 24px' }}>
        <div style={{ padding: '40px 0 8px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 44, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
            Book Your <span style={{ color: '#39FF7A' }}>Slot</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#A0A8B8', margin: '8px 0 0' }}>
            Hourly and extended arena bookings for TURFON24.
          </p>
        </div>
      </div>

      <Pricing verification={verification} onReserveArena={() => setShowArena(true)} />
      {showArena ? <ExtendedBooking verified={verification.verified} onCloseArena={() => setShowArena(false)} /> : null}
      <Footer />
    </div>
  )
}
