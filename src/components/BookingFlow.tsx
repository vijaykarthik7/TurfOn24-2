import { useEffect, useRef, useState, useCallback, type KeyboardEvent, type ClipboardEvent, type MouseEvent as ReactMouseEvent } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { GREEN, LIME, CHROME } from '../data/tf24'
import { requestOtp, verifyOtp } from '../services/otpService'
import Booking from './Booking'
import ExtendedEnquiry from './ExtendedEnquiry'

type View = 'select' | 'verify' | 'hourly' | 'extended'

function BackBar({ onBack }: { onBack: () => void }) {
  return (
    <div className="tf24-bflow-back">
      <button className="tf24-bflow-back-btn" onClick={onBack}>
        <span className="tf24-bflow-back-arrow">←</span> Change Booking Type
      </button>
    </div>
  )
}

type GatePhase = 'idle' | 'sent' | 'verifying' | 'verified'

function OtpPhone({ phase, sentAt }: { phase: GatePhase; sentAt: number }) {
  return (
    <div className="tf24-otp-scene">
      <span className="tf24-otp-hud tf24-otp-hud-01">01 · Verify</span>
      <span className="tf24-otp-hud tf24-otp-hud-secure">Secure</span>
      <span className="tf24-otp-hud tf24-otp-hud-otp">OTP</span>
      <span className="tf24-otp-hud tf24-otp-hud-verified">Verified</span>

      <div
        key={sentAt}
        className={
          'tf24-otp-phone' +
          (phase === 'sent' ? ' shake' : '') +
          (phase === 'verifying' ? ' verifying' : '') +
          (phase === 'verified' ? ' verified' : '')
        }
      >
        <div className="tf24-otp-notch">
          <span className="tf24-otp-cam" />
        </div>
        <div className="tf24-otp-screen">
          {phase === 'verified' ? (
            <div className="tf24-otp-check">
              <svg viewBox="0 0 52 52" className="tf24-otp-check-svg">
                <circle className="tf24-otp-check-circle" cx="26" cy="26" r="24" />
                <path className="tf24-otp-check-tick" d="M14 27l8 8 16-17" />
              </svg>
              <div className="tf24-otp-check-label">Verified</div>
            </div>
          ) : (
            <>
              <div className="tf24-otp-brand">Turf on 24</div>
              <div className="tf24-otp-status">
                {phase === 'verifying' ? 'Checking code' : 'Verifying player'}
              </div>
              <span className="tf24-otp-scanline" />
              <div className={'tf24-otp-dots' + (phase === 'sent' ? ' entered' : '')}>
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} className="tf24-otp-dot" style={{ animationDelay: `${i * 0.18}s` }} />
                ))}
              </div>
              <div className={'tf24-otp-ready' + (phase === 'sent' ? ' enter' : '')}>
                {phase === 'sent' ? 'Enter Code' : 'Ready to verify'}
              </div>
              <div className="tf24-otp-foot">
                <span className="tf24-otp-foot-dot" /> Secure Verification
              </div>
            </>
          )}
        </div>
      </div>

      <div key={phase + '-' + sentAt} className="tf24-otp-notif">
        {phase === 'verified' ? '✓ Verified' : phase === 'verifying' ? 'Verifying…' : phase === 'sent' ? 'OTP Sent' : 'OTP Received'}
      </div>

      {phase === 'verified' && (
        <div className="tf24-otp-badge">
          <span className="tf24-otp-badge-ico">✓</span> Phone Verified
        </div>
      )}
    </div>
  )
}

function OtpNumberCard() {
  const [loop, setLoop] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setLoop(l => l + 1), 6400)
    return () => clearInterval(t)
  }, [])
  const nameChars = 'XXXXX'
  const mobChars = 'XXXXXXXXXX'

  return (
    <div className="tf24-otp-phone tf24-otp-numcard">
      <div className="tf24-otp-notch">
        <span className="tf24-otp-cam" />
      </div>
      <div className="tf24-otp-screen tf24-otp-numscreen">
        <div className="tf24-otp-brand">Turf on 24</div>
        <div className="tf24-otp-status">Verifying player</div>
        <div key={loop} className="tf24-otp-numloop">
          <div className="tf24-otp-step active-1">
            <div className="tf24-otp-step-label">Full Name</div>
            <div className="tf24-otp-step-field">
              {nameChars.split('').map((c, i) => (
                <span key={i} className="tf24-otp-char" style={{ animationDelay: `${0.4 + i * 0.25}s` }}>
                  {c}
                </span>
              ))}
              <span className="tf24-otp-cursor" style={{ animationDelay: '0.4s', animationDuration: '1.8s' }} />
              <span className="tf24-otp-step-check" style={{ animationDelay: '1.9s' }}>✓</span>
            </div>
            <div className="tf24-otp-step-status" style={{ animationDelay: '2.1s' }}>Name Entered</div>
          </div>

          <div className="tf24-otp-step-link">
            <span className="tf24-otp-step-link-dot" />
          </div>

          <div className="tf24-otp-step active-2">
            <div className="tf24-otp-step-label">Mobile Number</div>
            <div className="tf24-otp-step-field">
              <span className="tf24-otp-mob-prefix">+91</span>
              {mobChars.split('').map((c, i) => (
                <span key={i} className="tf24-otp-char" style={{ animationDelay: `${2.6 + i * 0.18}s` }}>
                  {c}
                </span>
              ))}
              <span className="tf24-otp-cursor" style={{ animationDelay: '2.6s', animationDuration: '1.9s' }} />
              <span className="tf24-otp-step-check" style={{ animationDelay: '4.5s' }}>✓</span>
            </div>
            <div className="tf24-otp-step-status" style={{ animationDelay: '4.7s' }}>Number Entered</div>
          </div>

          <div className="tf24-otp-ready" style={{ animationDelay: '5.1s' }}>
            <span className="tf24-otp-foot-dot" /> Ready to Send OTP
          </div>

          <span className="tf24-otp-scanline" style={{ animationDelay: '5.2s' }} />
        </div>
      </div>
    </div>
  )
}

function OtpGate({ onVerified, onBack }: { onVerified: (name: string, phone: string, token: string) => void; onBack: () => void }) {
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [phase, setPhase] = useState<GatePhase>('idle')
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const [sentAt, setSentAt] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const changePhone = (v: string) => {
    setPhone(v.replace(/\D/g, '').slice(0, 10))
    if (phase !== 'idle') {
      setPhase('idle')
      setOtp(['', '', '', '', '', ''])
      setError('')
    }
  }

  const send = () => {
    if (!name.trim()) { setError('Please enter your full name.'); return }
    if (!/^\d{10}$/.test(phone)) { setError('Enter a valid 10-digit mobile number.'); return }
    setError('')
    const res = requestOtp(phone)
    if (res.ok) {
      setOtp(['', '', '', '', '', ''])
      setPhase('sent')
      setSentAt(s => s + 1)
      setCooldown(Math.ceil(res.cooldownMs / 1000))
      otpRefs.current[0]?.focus()
    } else {
      setError(res.error)
    }
  }

  const changeDigit = (i: number, v: string) => {
    const digit = v.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[i] = digit
    setOtp(next)
    if (digit && i < 5) otpRefs.current[i + 1]?.focus()
    setError('')
  }

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus()
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!text) return
    e.preventDefault()
    const next = [...otp]
    for (let j = 0; j < text.length; j++) next[j] = text[j]
    setOtp(next)
    otpRefs.current[Math.min(text.length, 5)]?.focus()
    setError('')
  }

  const verify = () => {
    const code = otp.join('')
    if (code.length !== 6) { setError('Enter the 6-digit code.'); return }
    setPhase('verifying')
    setTimeout(() => {
      const res = verifyOtp(phone, code)
      if (res.ok) {
        setPhase('verified')
        setError('')
        setTimeout(() => onVerified(name.trim(), phone, res.token), 850)
      } else {
        setPhase('sent')
        setError(res.error)
      }
    }, 700)
  }

  const labelStyle: React.CSSProperties = { fontFamily: 'Space Grotesk', fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.45)', marginBottom: 8, display: 'block' }
  const errStyle: React.CSSProperties = { fontFamily: 'Space Grotesk', fontSize: 11, color: '#FF6B6B', marginTop: 10 }

  return (
    <section id="booking" style={{ position: 'relative', zIndex: 2, background: 'rgba(11,24,36,0.55)', overflow: 'hidden', padding: '90px 0 120px' }}>
      {/* Blue atmospheric shade */}
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
      <div className="pitch-lines" />
      <div style={{ position: 'absolute', bottom: -60, right: -30, fontFamily: 'Bebas Neue', fontSize: 300, lineHeight: 1, color: 'rgba(23,107,2,0.16)', WebkitTextStroke: '1px rgba(57,255,122,0.10)', userSelect: 'none', pointerEvents: 'none', zIndex: 0 }}>
        OTP.
      </div>

      <div className="tf24-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="tf24-otp-wrap">
          {/* Heading */}
          <div className="tf24-otp-head">
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 18 }}>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#39FF7A', textShadow: '0 0 14px rgba(57,255,122,0.5)', paddingLeft: '0.45em' }}>
                Verify Your Phone
              </span>
              <span style={{ width: 64, height: 2, background: '#39FF7A' }} />
            </div>
            <h2 style={{ fontFamily: 'Bebas Neue', fontWeight: 400, fontSize: 'clamp(48px, 5.5vw, 88px)', textTransform: 'uppercase', lineHeight: 0.9, margin: 0, color: CHROME }}>
              Unlock your
              <br />
              <span className="tf24-grad-word" style={{ color: GREEN }}>pitch.</span>
            </h2>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: 15, lineHeight: 1.7, color: 'rgba(243,243,243,0.75)', maxWidth: 560, margin: '24px auto 0' }}>
              We'll send a one-time OTP to verify your number before you continue.
            </p>
          </div>

          {/* Phone card + connection + form + connection + OTP phone */}
          <div className="tf24-otp-layout">
          <div className="tf24-otp-device-col">
            <OtpNumberCard />
          </div>

          <div className="tf24-otp-conn tf24-otp-conn-left">
            <span className="tf24-otp-conn-node" />
            <span className="tf24-otp-conn-line"><span className="tf24-otp-conn-pulse" /></span>
            <span className="tf24-otp-conn-node" />
          </div>

          <div className="tf24-verify-card tf24-otp-form">
          <span className="tf24-bflow-corner tf24-bflow-corner-tl" />
          <span className="tf24-bflow-corner tf24-bflow-corner-br" />

          <label className="tf24-eq-label" style={labelStyle}>Full Name *</label>
          <input
            className="tf24-eq-input"
            placeholder="Enter your full name"
            value={name}
            maxLength={60}
            onChange={e => { setName(e.target.value); if (error && !error.includes('name')) setError('') }}
          />

          <label className="tf24-eq-label" style={{ ...labelStyle, marginTop: 22 }}>Phone Number *</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <div className="tf24-eq-prefix">+91</div>
            <input
              className="tf24-eq-input"
              style={{ flex: 1 }}
              placeholder="Enter mobile number"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={e => changePhone(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && phase === 'idle') send() }}
            />
          </div>
          {phase === 'idle' && (
            <button className="tf24-eq-send" style={{ marginTop: 24 }} onClick={send}>
              Send OTP
              <span style={{ fontSize: 16 }}>→</span>
            </button>
          )}

          {phase === 'sent' && (
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: GREEN, margin: '20px 0 6px' }}>
                OTP Sent
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: 'rgba(243,243,243,0.75)', lineHeight: 1.6, marginBottom: 16 }}>
                We've sent a verification code to <span style={{ color: CHROME, fontWeight: 600 }}>+91 {phone.replace(/(\d{5})(\d{5})/, '$1 $2')}</span>
              </div>
              <div className="tf24-otp-boxes">
                {Array.from({ length: 6 }, (_, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el }}
                    className="tf24-otp-box"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={otp[i]}
                    onChange={e => changeDigit(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    aria-label={`OTP digit ${i + 1}`}
                  />
                ))}
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.35)', textAlign: 'center', marginTop: 12 }}>
                Demo OTP: 123456
              </div>
              {error ? <div style={{ ...errStyle, textAlign: 'center' }}>{error}</div> : null}
              <button className="tf24-eq-send" style={{ marginTop: 24 }} onClick={verify}>
                Verify OTP
                <span style={{ fontSize: 16 }}>→</span>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14, fontFamily: 'Space Grotesk', fontSize: 11, letterSpacing: '0.08em', color: 'rgba(243,243,243,0.5)' }}>
                {cooldown > 0 ? (
                  <span>Resend OTP in {cooldown}s</span>
                ) : (
                  <button onClick={send} style={{ background: 'none', border: 'none', color: GREEN, fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit', cursor: 'pointer', textTransform: 'uppercase', padding: 0 }}>
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {phase === 'verifying' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '22px 0', fontFamily: 'Space Grotesk', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: GREEN }}>
              <span className="tf24-eq-spin" />
              Verifying
            </div>
          )}

          {phase === 'verified' && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 18px', border: '1px solid rgba(57,255,122,0.5)', background: 'rgba(57,255,122,0.08)', borderRadius: 4, boxShadow: '0 0 22px rgba(57,255,122,0.14)' }}>
                <span className="tf24-eq-verified-ico">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GREEN }}>
                    Phone Verified
                  </div>
                  <div style={{ fontFamily: 'Space Grotesk', fontSize: 12, color: 'rgba(243,243,243,0.65)', marginTop: 3 }}>+91 {phone.replace(/(\d{5})(\d{5})/, '$1 $2')}</div>
                </div>
              </div>
              <div style={{ fontFamily: 'Space Grotesk', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: LIME, marginTop: 16 }}>
                Opening your booking…
              </div>
            </div>
          )}

          {phase === 'idle' && error ? <div style={errStyle}>{error}</div> : null}

          <button onClick={onBack} className="tf24-bflow-back-link">
            ← Back to booking type
          </button>
          </div>

            <div className="tf24-otp-conn tf24-otp-conn-right">
              <span className="tf24-otp-conn-node" />
              <span className="tf24-otp-conn-line"><span className="tf24-otp-conn-pulse" /></span>
              <span className="tf24-otp-conn-node" />
            </div>

            <div className="tf24-otp-phone-col">
              <OtpPhone phase={phase} sentAt={sentAt} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

type ModeKey = 'hourly' | 'extended'

const BCC_MODES: Record<ModeKey, { num: string; name: string; sub: string; price: string; unit: string; line: string; status: string; cta: string }> = {
  hourly: { num: '01', name: 'HOURLY', sub: 'BOOKING', price: '₹700', unit: '/ HOUR', line: 'SINGLE PLAYING SLOT', status: 'AVAILABLE', cta: 'BOOK NOW' },
  extended: { num: '02', name: 'EXTENDED', sub: 'SESSION', price: 'CUSTOM', unit: 'SESSION', line: 'DATE + TIME · LONGER PLAY', status: 'ENQUIRY', cta: 'SEND ENQUIRY' },
}

const bccMono = { fontFamily: 'Space Grotesk', fontSize: 9.5, fontWeight: 600, letterSpacing: '0.26em', textTransform: 'uppercase' } as const

function BookingControlCenter({ onSelect }: { onSelect: (mode: ModeKey) => void }) {
  const [active, setActive] = useState<ModeKey>('hourly')
  const [hovered, setHovered] = useState<ModeKey | null>(null)
  const focus: ModeKey = hovered ?? active
  const hourlyFocus = focus === 'hourly'

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 55, damping: 16 })
  const sy = useSpring(my, { stiffness: 55, damping: 16 })
  const ghostAx = useTransform(sx, v => v * 18)
  const ghostAy = useTransform(sy, v => v * 12)
  const ghostBx = useTransform(sx, v => v * -18)
  const ghostBy = useTransform(sy, v => v * -12)

  const handleMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  const renderMode = (key: ModeKey, side: 'left' | 'right') => {
    const m = BCC_MODES[key]
    const isActive = focus === key
    return (
      <button
        key={key}
        className="tf24-bcc-mode"
        onMouseEnter={() => setHovered(key)}
        onMouseLeave={() => setHovered(null)}
        onFocus={() => setHovered(key)}
        onBlur={() => setHovered(null)}
        onClick={() => { setActive(key); onSelect(key) }}
        aria-pressed={isActive}
      >
        <motion.span
          className="tf24-bcc-ghost"
          aria-hidden="true"
          style={{ left: side === 'left' ? 14 : undefined, right: side === 'right' ? 14 : undefined, x: side === 'left' ? ghostAx : ghostBx, y: side === 'left' ? ghostAy : ghostBy }}
          animate={{ opacity: isActive ? 0.9 : 0.32 }}
          transition={{ duration: 0.4 }}
        >
          {m.num}
        </motion.span>

        <motion.span
          style={{ position: 'relative', zIndex: 1, display: 'block' }}
          animate={{ opacity: isActive ? 1 : 0.42, scale: isActive ? 1 : 0.985 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <span style={{ ...bccMono, color: 'rgba(243,243,243,0.4)', display: 'block', marginBottom: 14 }}>
            {m.num} · MODE SELECT
          </span>
          <span style={{ display: 'block', fontFamily: 'Bebas Neue', fontWeight: 400, fontSize: 'clamp(38px, 4.2vw, 62px)', lineHeight: 0.92, textTransform: 'uppercase', color: CHROME }}>
            {m.name}<br />{m.sub}
          </span>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 22 }}>
            <span style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(34px, 3.4vw, 52px)', lineHeight: 1, color: key === 'hourly' ? GREEN : '#00C9FF', textShadow: key === 'hourly' ? '0 0 24px rgba(57,255,122,0.45)' : '0 0 24px rgba(0,201,255,0.4)' }}>
              {m.price}
            </span>
            <span style={{ ...bccMono, color: 'rgba(243,243,243,0.55)' }}>{m.unit}</span>
          </span>
          <span style={{ display: 'block', marginTop: 12, fontFamily: 'Space Grotesk', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(243,243,243,0.5)' }}>
            {m.line}
          </span>
          <span className="tf24-bcc-status" style={{ marginTop: 20, color: isActive ? (key === 'hourly' ? GREEN : '#00C9FF') : 'rgba(243,243,243,0.45)' }}>
            <span className="tf24-live-dot" style={{ background: key === 'hourly' ? '#39FF7A' : '#00C9FF', boxShadow: `0 0 12px ${key === 'hourly' ? '#39FF7A' : '#00C9FF'}` }} />
            {m.status}
          </span>
        </motion.span>

        <motion.span
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.45 }}
        >
          <span style={{ position: 'absolute', inset: 0, background: side === 'left'
            ? 'radial-gradient(ellipse at 22% 62%, rgba(57,255,122,0.12), transparent 58%)'
            : 'radial-gradient(ellipse at 78% 62%, rgba(0,201,255,0.12), transparent 58%)' }} />
        </motion.span>
      </button>
    )
  }

  return (
    <motion.div
      className="tf24-bcc-frame"
      onMouseMove={handleMove}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="tf24-bcc-grid" />
      <span className="tf24-bcc-scan" />
      <span className="tf24-bflow-corner tf24-bflow-corner-tl" />
      <span className="tf24-bflow-corner tf24-bflow-corner-br" />

      <div className="tf24-bcc-strip">
        <span>TURFON24 · BOOKING CONTROL CENTER</span>
        <span className="tf24-bcc-hide-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span className="tf24-live-dot" /> SYSTEM ONLINE · LIVE
        </span>
        <span>PITCH 01 · {hourlyFocus ? 'HOURLY MODE' : 'EXTENDED MODE'}</span>
      </div>

      <div className="tf24-bcc-modes">
        {renderMode('hourly', 'left')}
        {renderMode('extended', 'right')}
      </div>

      <div className="tf24-bcc-timeline" aria-hidden="true">
        <span className="tf24-bcc-track" />
        <span className="tf24-bcc-tick" style={{ left: 0 }} />
        <span className="tf24-bcc-tick" style={{ right: 0 }} />
        <motion.span
          className="tf24-bcc-node"
          animate={{ left: hourlyFocus ? '25%' : '75%', borderColor: hourlyFocus ? 'rgba(57,255,122,0.95)' : 'rgba(0,201,255,0.95)' }}
          transition={{ type: 'spring', stiffness: 120, damping: 16 }}
        />
        <motion.span
          style={{ position: 'absolute', top: '50%', marginTop: 14, transform: 'translateX(-50%)', whiteSpace: 'nowrap', ...bccMono, color: 'rgba(243,243,243,0.45)' }}
          animate={{ left: hourlyFocus ? '25%' : '75%' }}
          transition={{ type: 'spring', stiffness: 120, damping: 16 }}
        >
          ↑ ACTIVE SELECTION
        </motion.span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap', padding: '20px 48px 26px', borderTop: '1px solid rgba(243,243,243,0.08)' }}>
        <span className="tf24-bcc-hide-sm" style={{ ...bccMono, color: 'rgba(243,243,243,0.4)' }}>
          SECURE OTP VERIFICATION · INSTANT SLOT CONFIRMATION
        </span>
        <button className="tf24-btn-primary" style={{ height: 54, padding: '0 36px', fontSize: 13, borderRadius: 4, minWidth: 230, justifyContent: 'center' }} onClick={() => onSelect(focus)}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={focus}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
            >
              {BCC_MODES[focus].cta} <span>→</span>
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <div className="tf24-bcc-strip tf24-bcc-strip-b">
        <span className="tf24-bcc-hide-sm">18.5204° N · 73.8567° E</span>
        <span>SECTOR GRID · A-04</span>
        <span>SYS.OK</span>
      </div>
    </motion.div>
  )
}

export default function BookingFlow() {
  const [view, setView] = useState<View>('select')
  const [leaving, setLeaving] = useState(false)
  const [target, setTarget] = useState<'hourly' | 'extended'>('hourly')
  const [gate, setGate] = useState<{ name: string; phone: string; token: string } | null>(null)

  const transition = (next: View, after: () => void) => {
    if (leaving) return
    setLeaving(true)
    setTimeout(() => { after(); setView(next); setLeaving(false) }, 420)
  }

  const choose = (v: 'hourly' | 'extended') => {
    setTarget(v)
    transition('verify', () => setGate(null))
  }

  const onVerified = (name: string, phone: string, token: string) => {
    setGate({ name, phone, token })
    transition(target, () => {})
  }

  const back = () => {
    transition('select', () => setGate(null))
  }

  if (view === 'verify') {
    return (
      <div key="verify" className={leaving ? 'tf24-bflow-leaving' : 'tf24-bflow-entering'}>
        <OtpGate onVerified={onVerified} onBack={back} />
      </div>
    )
  }

  if (view === 'hourly') {
    return (
      <div key="hourly" className={leaving ? 'tf24-bflow-leaving' : 'tf24-bflow-entering'}>
        <BackBar onBack={back} />
        <Booking />
      </div>
    )
  }

  if (view === 'extended') {
    return (
      <div key="extended" className={leaving ? 'tf24-bflow-leaving' : 'tf24-bflow-entering'}>
        <BackBar onBack={back} />
        <ExtendedEnquiry key={`extended-${gate?.phone ?? ''}`} verifiedPhone={gate?.phone ?? ''} verifiedToken={gate?.token ?? ''} verifiedName={gate?.name ?? ''} />
      </div>
    )
  }

  return (
    <section
      id="booking"
      key="select"
      className={leaving ? 'tf24-bflow-leaving' : 'tf24-bflow-entering'}
      style={{ position: 'relative', zIndex: 2, background: 'rgba(11,24,36,0.55)', overflow: 'hidden', padding: '120px 0' }}
    >
      {/* Blue atmospheric shade */}
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
      <div className="pitch-lines" />
      <div style={{ position: 'absolute', top: -30, left: -24, fontFamily: 'Bebas Neue', fontSize: 300, lineHeight: 1, color: 'rgba(23,107,2,0.16)', WebkitTextStroke: '1px rgba(57,255,122,0.10)', userSelect: 'none', pointerEvents: 'none', zIndex: 0 }}>
        PLAY.
      </div>

      <div className="tf24-container tf24-bflow-select">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: 46 }}
        >
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 18 }}>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#39FF7A', textShadow: '0 0 14px rgba(57,255,122,0.5)', paddingLeft: '0.45em' }}>
              Choose How You Want To Play
            </span>
            <span style={{ width: 64, height: 2, background: '#39FF7A' }} />
          </div>
          <h2 style={{ fontFamily: 'Bebas Neue', fontWeight: 400, fontSize: 'clamp(52px, 8vw, 120px)', textTransform: 'uppercase', lineHeight: 0.88, margin: 0, color: CHROME }}>
            Book Your <span className="tf24-grad-word" style={{ color: LIME }}>Pitch</span>
          </h2>
        </motion.div>

        {/* Booking Control Center */}
        <BookingControlCenter onSelect={choose} />
      </div>
    </section>
  )
}