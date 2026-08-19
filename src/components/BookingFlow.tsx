import { useEffect, useRef, useState, useCallback, type ReactNode, type KeyboardEvent, type ClipboardEvent } from 'react'
import { GREEN, LIME, CHROME } from '../data/tf24'
import { requestOtp, verifyOtp } from '../services/otpService'
import Booking from './Booking'
import ExtendedEnquiry from './ExtendedEnquiry'

const iconProps = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

function TypewriterText({ words, className }: { words: string[]; className?: string }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => {
        setDone(false)
        setActiveIdx(0)
        setCharIdx(0)
      }, 2000)
      return () => clearTimeout(t)
    }

    const word = words[activeIdx]

    if (charIdx <= word.length) {
      const t = setTimeout(() => setCharIdx(c => c + 1), 80)
      return () => clearTimeout(t)
    }

    if (activeIdx < words.length - 1) {
      const t = setTimeout(() => {
        setActiveIdx(i => i + 1)
        setCharIdx(0)
      }, 400)
      return () => clearTimeout(t)
    }

    const t = setTimeout(() => setDone(true), 600)
    return () => clearTimeout(t)
  }, [charIdx, activeIdx, words, done])

  return (
    <span className={className}>
      {words.map((word, i) => {
        if (i > activeIdx) return null
        const visible = i === activeIdx ? word.slice(0, charIdx) : word
        const showCursor = i === activeIdx && !done
        return (
          <span key={i} className="tf24-type-line">
            {visible}{showCursor && <span className="tf24-type-cursor">|</span>}
          </span>
        )
      })}
    </span>
  )
}

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

function Panel({
  num,
  title,
  desc,
  meta,
  icon,
  onClick,
  delay,
  typewriter,
}: {
  num: string
  title: ReactNode
  desc: string
  meta: string
  icon: ReactNode
  onClick: () => void
  delay: string
  typewriter?: string[]
}) {
  return (
    <button className="tf24-bflow-panel" style={{ animationDelay: delay }} onClick={onClick}>
      <span className="tf24-bflow-sweep" />
      <span className="tf24-bflow-corner tf24-bflow-corner-tl" />
      <span className="tf24-bflow-corner tf24-bflow-corner-br" />
      <span className="tf24-bflow-head">
        <span className="tf24-bflow-icon">{icon}</span>
        <span className="tf24-bflow-num">{num}</span>
      </span>
      <span className="tf24-bflow-title">{title}</span>
      <span className="tf24-bflow-desc">{desc}</span>
      <span className="tf24-bflow-meta">{meta}</span>
      {typewriter && <span className="tf24-bflow-typewriter"><TypewriterText words={typewriter} /></span>}
      <span className="tf24-bflow-arrow">→</span>
    </button>
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
      <div className="pitch-lines" />
      <div style={{ position: 'absolute', bottom: -60, right: -30, fontFamily: 'Bebas Neue', fontSize: 300, lineHeight: 1, color: 'rgba(23,107,2,0.16)', WebkitTextStroke: '1px rgba(57,247,42,0.10)', userSelect: 'none', pointerEvents: 'none', zIndex: 0 }}>
        OTP.
      </div>

      <div className="tf24-container">
        <div className="tf24-otp-wrap">
          {/* Heading */}
          <div className="tf24-otp-head">
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 18 }}>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#18AAC0', textShadow: '0 0 14px rgba(24,170,192,0.5)', paddingLeft: '0.45em' }}>
                Verify Your Phone
              </span>
              <span style={{ width: 64, height: 2, background: '#18AAC0' }} />
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
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 18px', border: '1px solid rgba(57,247,42,0.5)', background: 'rgba(57,247,42,0.08)', borderRadius: 4, boxShadow: '0 0 22px rgba(57,247,42,0.14)' }}>
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
      <div className="pitch-lines" />
      <div style={{ position: 'absolute', top: -30, left: -24, fontFamily: 'Bebas Neue', fontSize: 300, lineHeight: 1, color: 'rgba(23,107,2,0.16)', WebkitTextStroke: '1px rgba(57,247,42,0.10)', userSelect: 'none', pointerEvents: 'none', zIndex: 0 }}>
        PLAY.
      </div>

      <div className="tf24-container tf24-bflow-select">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 18 }}>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 600, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#39FF14', textShadow: '0 0 14px rgba(57,255,20,0.5)', paddingLeft: '0.45em' }}>
              Book Your Play
            </span>
            <span style={{ width: 64, height: 2, background: '#39FF14' }} />
          </div>
          <h2 style={{ fontFamily: 'Bebas Neue', fontWeight: 400, fontSize: 'clamp(52px, 8vw, 120px)', textTransform: 'uppercase', lineHeight: 0.88, margin: 0, color: CHROME }}>
            How do you want
            <br />
            to <span className="tf24-grad-word" style={{ color: LIME }}>play?</span>
          </h2>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: 15, lineHeight: 1.7, color: 'rgba(243,243,243,0.75)', maxWidth: 440, margin: '22px auto 0' }}>
            Choose your booking type to continue.
          </p>
        </div>

        {/* Booking type options */}
        <div className="tf24-bflow-grid">
          <Panel
            num="01"
            title={<>Hourly<br />Booking</>}
            desc="Book a single playing slot"
            meta="₹700 / HOUR"
            delay="0.1s"
            typewriter={['Book Now,', 'Play Now,', 'Score Big.']}
            icon={
              <svg {...iconProps} aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
                <path d="M12 2v3M12 19v3" />
              </svg>
            }
            onClick={() => choose('hourly')}
          />
          <Panel
            num="02"
            title={<>Extended<br />Booking</>}
            desc="Plan a longer session"
            meta="Send an enquiry"
            delay="0.22s"
            typewriter={['Team Up,', 'Fix Date,', 'Reserve Slot.']}
            icon={
              <svg {...iconProps} aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M8 3v4M16 3v4M3 10h18" />
                <path d="M12 13v6M9 16h6" />
              </svg>
            }
            onClick={() => choose('extended')}
          />
        </div>
      </div>
    </section>
  )
}